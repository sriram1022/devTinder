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

// app.use("/",(req,res)=>{
//     res.send("hellow world")
// })
// app.use("/2",(req,res)=>{
//       res.send("this is 2nd rout")
// })

const{tokenAuth} = require("./src/middleware/auth")

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


app.post("/signup",async (req,res)=>{
     

try{
   
    validationSignup(req.body);
    const{firstName,lastName,emailId,password} = req.body
    let hashPassword =  await bcrypt.hash(password,10);
    console.log(hashPassword);
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


app.post("/login",async(req,res)=>{

 try{
     const {emailId,password} = req.body;
     
    if(!validator.isEmail(emailId)){
    throw new Error("invalid credentionals");
   }
    let user = await UserModel.findOne({emailId})
    
    if(!user){
        throw new Error("entered email is not found");
    }
    let dcryptedPassword = await bcrypt.compare(password,user.password);
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

app.get("/getprofile", tokenAuth, async(req,res)=>{
   
  try{
       const user = req.userDetails;
       console.log(user)
       res.send(user)
    }
    catch(err){
           res.status(500).send("error in fetching  user data")
    }
})

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

app.get("/getAllprofile", async(req,res)=>{
    const userEmail = req.body.emailId;  // Changed from req.body to req.query
    console.log(userEmail)

    try{
        let userDetails = await UserModel.find({});
        res.send(userDetails);
    }
    catch(err){
           res.status(500).send("error in fetching  user data")
    }
})

app.delete("/deleteUser", async(req,res)=>{
      
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

app.patch("/updateUser/:userId",async (req,res)=>{
    let userId = req.params.userId;
    console.log(userId)
    let data = req.body;
    console.log(data)
    let allowed_fields = ["firstName","lastName","gender","skills"]
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

app.patch("/updateUserByEmail", async (req,res)=>{
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



connectionDb().then(()=>{
       console.log("db connected sucessfully");
       app.listen(9999,()=>{
    console.log("server is running")
})
}).catch((err)=>{
    console.log("unable to connect")  
})


