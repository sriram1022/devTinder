const express = require("express");
const userRouter = express.Router();
const{UserModel} = require("../models/user");
const{tokenAuth} = require("../middleware/auth");
const {connectionRequestModel} = require("../models/conectionRequest");
userRouter.use(express.json());

userRouter.get("/user/request/received",tokenAuth, async(req,res)=>{
    try{
        const loggedInUser = req.userDetails;
        const connectionRequest = await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","emailId","photo"])

        res.json({message:"Data fetched sucessfully",data:connectionRequest})

    }
    catch(err){
        res.status(400).send({message:"unable to get the request "+ err.message})
    }
})

module.exports=userRouter


