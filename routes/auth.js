const express = require("express")

const router = express.Router();

// mapping the controllers for posts in the routes 
const {signup, login} = require('../controller/auth');
const {getEmail} = require('../controller/getEmail');
const{auth, isStudent, isAdmin} = require('../middlewares/auth')

router.post("/signup", signup)
router.post("/login", login,)

// protected route 
router.get("/test", auth,(req, res)=>{
    res.json({
        success:true,
        messege:"Welcome to the protected route for TESTS"
    });
});

router.get("/student", auth, isStudent, (req, res)=>{
    res.json({
        success:true,
        messege:"Welcome to the protected route for students"
    });
});
router.get("/admin", auth, isAdmin, (req, res)=>{
    res.json({
        success:true,
        messege:"Welcome to the protected route for Admin"
    })
});


router.get("/getEmail", auth, getEmail)

module.exports = router;