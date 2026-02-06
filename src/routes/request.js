const express = require("express");
const requestRouter = express.Router();
const{validationSignup} = require("../utils/validationSignup")
const bcrypt = require("bcrypt")
const{UserModel} = require("../models/user");
const validator = require("validator")
const{tokenAuth} = require("../middleware/auth")
const cookieParser = require("cookie-parser")
var jwt = require('jsonwebtoken');
const {connectionRequestModel} = require("../models/conectionRequest");

requestRouter.use(express.json());
requestRouter.use(cookieParser())

requestRouter.post("/request/send/:status/:toUserId",tokenAuth,async (req,res)=>{

    try{
          const fromUserId = req.userDetails._id;
          const toUserId = req.params.toUserId;
          const status = req.params.status;
          console.log(fromUserId,toUserId,status)

          const allowedStatus = ["interested","ignored"];



          if(!allowedStatus.includes(status)){
            return res.status(400).send({message:"invalid status value"});
          }
         const existingConnection = await  connectionRequestModel.findOne({
              $or :[{

                fromUserId: fromUserId,
                toUserId: toUserId
              },{
                fromUserId: toUserId,
                toUserId: fromUserId
              }]   

          });
            if(existingConnection){ 
                return res.status(400).send({message:"connection request already exists"});

            }

            const ifUserExist = await UserModel.findById(toUserId)

            if(!ifUserExist){
                return res.status(400).send({message:"user not found!"})
            }

          const newConnectionRequest = new connectionRequestModel({
               fromUserId,
               toUserId,
               status
           })

            const data = await newConnectionRequest.save();

            res.json({
                message: req.userDetails._id + "is" + status + "in"+ ifUserExist.firstName,
                data,
            })
            }
            catch(err){
                res.status(400).send("unable to send connection request" + err.message);
            }

  


})


requestRouter.post("/request/review/:status/:requestId",tokenAuth,async (req,res)=>{
  try{
   const loggedInUser = req.userDetails._id;
   
   const {status,requestId} = req.params;
   console.log(status,requestId,loggedInUser)
   const allowedStatus = ["accepted","rejected"];
    if(!allowedStatus.includes(status)){
            return res.status(400).send({message:"invalid status value"});
          }
       
           const existingConnection = await  connectionRequestModel.findOne({
             _id:requestId,
             toUserId:loggedInUser,
             status:"interested"

          });
            if(!existingConnection){ 
                return res.status(400).json({message:"connection request not found"});

            }
            existingConnection.status = status;

            const data = await existingConnection.save();

            res.json({message:"connection request "+status,data})

            
            }
  catch(err){

    res.status(404).send({message:"unable to procees request"+err.message})

  }
  

})

 
module.exports = requestRouter;