const {Router} = require("express")
const bcrypt=require("bcrypt")
const {z} = require("zod")
const jwt = require('jsonwebtoken')
const dotenv = require("dotenv")
dotenv.config()
const JWT_USER_SECRET = process.env.USER_SECRET
const { userModel,courseModel,purchaseModel } = require("../db")
const { userMiddleware } = require("../middleware/user")

const userRouter=Router()

userRouter.post('/signup',async(req,res)=>{
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
        await userModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName,
        });

        return res.json({
            message:"User signed up successfully"
        });
    }catch(error){
        return res.json({
            message:"User already exists"
        });
    }

});

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    const user=await userModel.findOne({email:email});

    if(!user){
        return res.json({
            message:"No user found with this email",
        });
    }

    const passwordMatch =await bcrypt.compare(password,user.password);

    if(passwordMatch){
        const token = jwt.sign({id:user._id.toString()},JWT_USER_SECRET);
        return res.json({
            token:token,
            message:"Token created successfully",
        });
    }

    return res.json({
        message:"Invalid password",
    });
});

userRouter.get('/courses',async(req,res)=>{
    try{  
    const courses = await courseModel.find({});
    }catch(error){
        return res.json({
            message:"Cannot get Courses at this moment",
            error:error.message,
        })
    }

    res.json({
        courses
    });

});

userRouter.post('/purchase',userMiddleware,async(req,res)=>{
    const {courseId}=req.body;
    const userId =req.userId;

    try{
        await purchaseModel.create({
            courseId:courseId,
            userId:userId,
        })
    }catch(error){
        return res.json({
            message:"Cannot purchase course at this moment",
            error:error.message,
        });
    }

    res.json({
        message:"Course purchased successfully",
    });
});

userRouter.get('/purchasedCourses',userMiddleware,async(req,res)=>{
    const userId = req.userId;
    try{
        const purchasedCourses = await purchaseModel.find({userId:userId});
        const courseIds = purchasedCourses.map((p)=>p.courseId);
    }catch(error){
        return res.json({
            message:"No courses found!",
            error:error.message,
        });
    }
    res.json({
        purchasedCourses:courseIds,
    });
});

module.exports={
    userRouter,
}