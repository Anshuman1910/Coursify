const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const JWT_USER_SECRET = process.env.JWT_USER_SECRET

function userMiddleware(req,res,next){
    const token = req.headers.token;

    if(token){
        const decodedData=jwt.verify(token,JWT_USER_SECRET);
        if(decodedData){
            req.userId=decodedData.id;
            next();
    }
}
 return res.json({
    message:"No token Found!"
 })
}

module.exports={
    userMiddleware
}
