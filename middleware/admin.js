const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const JWT_ADMIN_SECRET = process.env.JWT_ADMIN_SECRET

function adminMiddleware(req,res,next){
    const token = req.headers.token;

    if(token){
        const decodedData=jwt.verify(token,JWT_ADMIN_SECRET);
        if(decodedData){
            req.adminId=decodedData.id;
            next();
    }
}
 return res.json({
    message:"No token Found!"
 })
}

module.exports={
    adminMiddleware
}
