const {Router} = require('express');
const bcrypt = require('bcrypt');
const {z} = require('zod');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const JWT_ADMIN_SECRET = process.env.ADMIN_SECRET;
const{adminModel,courseModel} = require('../db');
const {adminMiddleware} = require('../middleware/admin');


const adminRouter = Router();

adminRouter.post('/signup',async(req,res)=>{
    const requiredBody =z.object({
        email:z.string().email(),
        password:z.string().min(8).max(15),
        firstName:z.string().min(5).max(40),
        lastName:z.string().min(5).max(40),
    });
    const parsedDatWithSuccess=requiredBody.safeParse(req.body);

    if(!parsedDatWithSuccess.success){
        return res.json({
            message:"Inavalid credentials format.Please try again!"
        })
    } 

    const {email,password,firstName,lastName}=req.body;

    const hashedPassword=await bcrypt.hash(password,5);

    try{
        await adminModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName,
        });

        return res.json({
            message:"Admin signed up successfully"
        });
    }catch(error){
        return res.json({
            message:"Admin already exists"
        });
    }

});


adminRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    const admin=await adminModel.findOne({email:email});

    if(!admin){
        return res.json({
            message:"No Admin found with this email",
        });
    }

    const passwordMatch =await bcrypt.compare(password,admin.password);

    if(passwordMatch){
        const token = jwt.sign({id:admin._id.toString()},JWT_USER_SECRET);
        return res.json({
            token:token,
            message:"Token created successfully",
        });
    }

    return res.json({
        message:"Invalid password",
    });
});

adminRouter.post('/create-course',adminMiddleware,async(req,res)=>{
    const adminId=req.adminId;
    const{title,description,imageUrl,price}=req.body;

    try{
        await courseModel.create({
            title:title,
            description:description,
            imageUrl:imageUrl,
            price:price,
            creatorId:adminId,
        });
    }catch(err){
        return res.json({
            message:"Error creating course!",
            error:err.message,
        });
    }

    res.json({
        message:"Course Created Successfully!"
    });

});

adminRouter.get('/courses',adminMiddleware,async(req,res)=>{
    const adminId=req.adminId;

    try{
        const courses=await courseModel.find({creatorId:adminId});
    }catch(err){
        return res.json({
            message:"No courses found!",
            error:err.message,
        });
    }

    res.json({
        courses
    });
});

adminRouter.delete('/courses/:courseId',adminMiddleware,async(req,res)=>{
    const adminId=req.adminId;
    const courseId=req.params.courseId;

    try{
        await courseModel.deleteOne({creatorId:adminId,_id:courseId});
    }catch(err){
        return res.json({
            message:"Error deleting a course!",
            error:err.message,
        });
    }

    res.json({
        message:"Course Deleted Successfully!",
    });
});

adminRouter.put('/courses/:courseId',adminMiddleware,async(req,res)=>{
    const adminId=req.adminId;
    const courseId=req.params.courseId;
    const {title,description,imageUrl,price}=req.body;

    const course=await courseModel.findOne({creatorId:adminId,_id:courseId});

    if(!course){
        return res.json({
            message:"Course not Found!",
        });
    }

    try{
        await courseModel.updateOne({creatorId:adminId,_id:courseId},{
            title:title,
            description:description,
            imageUrl:imageUrl,
            price:price,
        });
    }catch(err){
        return res.json({
            message:"Error updating a course!",
            error:err.message,
        });
    }

    res.json({
        message:"Course Updated Successfully!",
    });
});

module.exports={
    adminRouter,
}
