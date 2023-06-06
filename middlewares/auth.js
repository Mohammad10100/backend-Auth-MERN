const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth=(req, res, next)=>{
    try {
        // extract token from body  (least secure: why???)
        // const token = req.body.token;

        // extract token from cookies 
        // const token = req.cookies.token;

        //extract token from header (safest: why???)
        // const token = req.header("Authorization").replace("Bearer ", "");

        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success:false,
                messege:"please provide token"
            })
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user= payload
        } catch (error) {
            return res.status(401).json({
                success:false,
                messege:"token is invalid"
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success:false,
            messege:"Something went wrong while verifying the token"
        })
    }
}

exports.isStudent=(req, res, next)=>{
    try {
        console.log(req.user.role);
        if(req.user.role!=='Student'){
            return res.status(401).json({
                success:false,
                messege:"This is a protected route for students"
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            messege:"Roles do not match"
        })
    }
}

exports.isAdmin=(req, res, next)=>{
    try {
        console.log(req.user.role);

        if(req.user.role!=='Admin'){
            return res.status(401).json({
                success:false,
                messege:"This is a protected route for admins"
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            messege:"Roles do not match"
        })
    }
}