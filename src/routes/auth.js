const express = require("express");
const authRouter = express.Router();
const{validationSignup} = require("../utils/validationSignup")
const bcrypt = require("bcrypt")
const{UserModel} = require("../models/user");
const validator = require("validator")
const{tokenAuth} = require("../middleware/auth")
const cookieParser = require("cookie-parser")
var jwt = require('jsonwebtoken');

authRouter.use(express.json());
authRouter.use(cookieParser())

authRouter.post("/signup",async (req,res)=>{
      try{
   
    validationSignup(req.body);
    const{firstName,lastName,emailId,password} = req.body
    let hashPassword =  await bcrypt.hash(password,10);
    const userData = new UserModel({
       firstName,
       lastName,
       emailId,
       password: hashPassword
       
    });
    await userData.save();

    res.send("users data inserted successfully");

     }
     catch(err){
        res.status(500).send("error in saving user data"+err.message)
     }
       })


authRouter.post("/login",async(req,res)=>{

 try{
     const {emailId,password} = req.body;
     console.log(emailId,password)
     
    if(!validator.isEmail(emailId)){
    throw new Error("invalid credentionals");
   }
    let user = await UserModel.findOne({emailId})

    console.log(user)
    if(!user){
        throw new Error("entered email is not found");
    }
    let dcryptedPassword = await bcrypt.compare(password,user.password);
    console.log(dcryptedPassword)
    if(!dcryptedPassword){
        throw new Error("invalid credentionals")
    }
    else{
        const token  = jwt.sign({userId: user._id}, "secretkey")
        res.cookie("token",token);
        res.send("login successful :" + token)
        
    }

 }
 catch(err){

     res.status(500).send("error : " + err.message )


 }


})

authRouter.post("/logout",(req,res)=>{
     res.cookie("token",null,{
        expires:new Date(Date.now()),
     });
     res.send("user logged out successfully");
  

})

module.exports = authRouter;
