const express = require('express');
const app = express();
const {connectionDb} = require("./src/config/database")
const { UserModel } = require("./src/models/user")
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser')
var jwt = require('jsonwebtoken');
require("./src/config/database")
const validator = require("validator")
const{validationSignup}= require("./src/utils/validationSignup")
app.use(express.json());
app.use(cookieParser())
const authRouter = require("./src/routes/auth")
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user")

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
// app.use("/",(req,res)=>{
//     res.send("hellow world")
// })
// app.use("/2",(req,res)=>{
//       res.send("this is 2nd rout")
// })
// app.use("/admin",adminAuth)
// app.get("/admin",(req,res)=>{
//     res.send("hello you are logged in successfully")
// })


// app.get("/user/:userid/:name",(req,res)=>{
//     console.log(req.params);
//     res.send({firstname:"sriram"})
// });

// app.post("/saveUser",(req,res)=>{
//     res.send({
//         firstname:"mittu",
//         age:27
              
//     })
// })
// // instead of this we can implement try and catch it is better way to handel error 

// app.use("/",(err,req,res,next)=>{
//     res.status(500).send("error in he code ");
// })
// app.get("/getprofile", async(req,res)=>{
//     const userEmail = req.body.emailId;  // Changed from req.body to req.query
//     console.log(userEmail)

//     try{
//         let userDetails = await UserModel.find({emailId: userEmail});
//         res.send(userDetails);
//     }
//     catch(err){
//            res.status(500).send("error in fetching  user data")
//     }
// })
connectionDb().then(()=>{
       console.log("db connected sucessfully");
       app.listen(9999,()=>{
    console.log("server is running")
})
}).catch((err)=>{
    console.log("unable to connect")  
})


