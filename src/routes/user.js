const express = require("express");
const userRouter = express.Router();
const{UserModel} = require("../models/user");
const{tokenAuth} = require("../middleware/auth");
const {connectionRequestModel} = require("../models/conectionRequest");
userRouter.use(express.json());


let USER_SAFE_DATA = "firstName emailId photo age gender skills";

userRouter.get("/user/request/received",tokenAuth, async(req,res)=>{
    try{
        const loggedInUser = req.userDetails;
        const connectionRequest = await connectionRequestModel.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","emailId","photo","age","gender","skills"])

        res.json({message:"Data fetched sucessfully",data:connectionRequest})

    }
    catch(err){
        res.status(400).send({message:"unable to get the request "+ err.message})
    }
})

userRouter.get("/user/connections",tokenAuth, async(req,res)=>{
    try{
       const loggedInUser = req.userDetails;
      
       const numberOfConnection = await connectionRequestModel.find({
          $or:[
            {
               toUserId:loggedInUser._id,status:"accepted"
            },
            {
              fromUserId:loggedInUser._id,status:"accepted"
            }
          ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

        const data = numberOfConnection.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString() ){
                return row.toUserId;
            }
            return row.fromUserId
        })
         res.json({message:"Data fetched sucessfully",data:data})

       
    }
    catch(err){
        res.status(400).send({message:"unable to get the request "+ err.message})
    }
})


userRouter.get("/user/feed",tokenAuth, async(req,res)=>{
    try{
       const loggedInUser = req.userDetails;
        let page = parseInt(req.query.page) || 1;
       let limit = parseInt(req.query.limit) || 10;
       limit = limit>50 ? 50 : limit;
       let skip = (page-1)*limit;
       console.log(page,limit,skip,req.query.page)
       const numberOfConnection = await connectionRequestModel.find({
          $or:[
            {
               toUserId:loggedInUser._id
            },
            {
              fromUserId:loggedInUser._id
            }
          ]
        }).select("fromUserId toUserId")

    const hidenUsersFromFeed = new Set();
    numberOfConnection.forEach(req=>{
        hidenUsersFromFeed.add(req.fromUserId);
         hidenUsersFromFeed.add(req.toUserId);

    })

    const users=await UserModel.find({

        $and:[{_id:{$nin:Array.from(hidenUsersFromFeed)}},
            {_id:{$ne:loggedInUser._id}},
        ]
        
    }).skip(skip).limit(limit)
    res.send(users)

       
    }
    catch(err){
        res.status(400).send({message:"unable to get the request "+ err.message})
    }
})

module.exports=userRouter


