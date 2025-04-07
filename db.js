const mongoose = require("mongoose")
const Schema = mongoose.Schema
const objectId = mongoose.Schema.Types.ObjectId

const userSchema = new Schema({
    email:{type:String,unique:true,required:true},
    password:String,
    firstName:String,
    lastName:String,
});

const adminSchema = new Schema({
    email:{type:String,unique:true,required:true},
    password:String,
    firstName:String,
    lastName:String,
});

const courseSchema = new Schema({
    title:{type:String,required:true},
    description:String,
    imageUrl:String,
    price:Number,
    creatorId:objectId,
});

const purchaseSchema = new Schema({
    courseId:objectId,
    userId:objectId,
});

const userModel = mongoose.model("Users",userSchema);
const adminModel=mongoose.model("Admin",adminSchema);
const courseModel = mongoose.model("Courses",courseSchema);
const purchaseModel = mongoose.model("Purchases",purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel,
}
