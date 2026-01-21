const express = require('express');
const app = express();

// app.use("/",(req,res)=>{
//     res.send("hellow world")
// })
// app.use("/2",(req,res)=>{
//       res.send("this is 2nd rout")
// })

const{adminAuth} = require("./src/middleware/auth")

app.use("/admin",adminAuth)
app.get("/admin",(req,res)=>{
    res.send("hello you are logged in successfully")
})


app.get("/user/:userid/:name",(req,res)=>{
    console.log(req.params);
    res.send({firstname:"sriram"})
});

app.post("/saveUser",(req,res)=>{
    res.send({firstname:"mittu"})
})


// instead of this we can implement try and catch it is better way to handel error 

app.use("/",(err,req,res,next)=>{
    res.status(500).send("error in he code ");
})

app.listen(9999,()=>{

    console.log("server is running")

})