const express = require("express");
const profileRouter = express.Router();
const{validationSignup} = require("../utils/validationSignup")
const bcrypt = require("bcrypt")
const{UserModel} = require("../models/user");
const validator = require("validator")
const{tokenAuth} = require("../middleware/auth")
const cookieParser = require("cookie-parser")
var jwt = require('jsonwebtoken');

profileRouter.use(express.json());
profileRouter.use(cookieParser())

profileRouter.get("/getprofile", tokenAuth, async(req,res)=>{
   
  try{
       const user = req.userDetails;
       console.log(user)
       res.send(user)
    }
    catch(err){
           res.status(500).send("error in fetching  user data")
    }
})

profileRouter.get("/getAllprofile", async(req,res)=>{
    const userEmail = req.body.emailId;  
   

    try{
        let userDetails = await UserModel.find({});
        res.send(userDetails);
    }
    catch(err){
           res.status(500).send("error in fetching  user data")
    }
})

profileRouter.delete("/deleteUser", async(req,res)=>{
      
      const userId = req.body.userId;

      try{
        console.log(userId)
          const deleteUser = await UserModel.findByIdAndDelete(userId);
          res.send("successfully deleted");

      }
      catch(err){
        res.status(404).send("unable to delete the user");
      }
})

profileRouter.patch("/updateUser/:userId",async (req,res)=>{
    let userId = req.params.userId;
    let data = req.body;
    let allowed_fields = ["firstName","lastName","gender","skills","photo"];
    let isUpdateisallowed = Object.keys(data).every(k=>
        allowed_fields.includes(k)
    );
    try{
       if(!isUpdateisallowed){
          throw new Error("update not allowed");
          
       }

       await UserModel.findByIdAndUpdate({_id:userId},data,{runValidators:true})
       res.send("sucessfully updated ")
    }
    catch(err){
        res.status(404).send("something went wrong"+err.message)
    }
})

profileRouter.patch("/updateUserByEmail", async (req,res)=>{
    let emailId = req.body.emailId;
    console.log(emailId)
    let data = req.body;
    console.log(data)
    
    try{
     let result =  await UserModel.findOneAndUpdate({emailId: emailId}, data)
       if(result===null){
        return res.status(404).send("user not found")
       }
       res.send("sucessfully updated ")
    }
    catch(err){
        res.status(404).send("something went wrong")
    }
})

module.exports = profileRouter;
