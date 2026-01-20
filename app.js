const express = require('express');
const app = express();

app.use("/",(req,res)=>{
    res.send("hellow world")
})
app.use("/2",(req,res)=>{
      res.send("this is 2nd rout")
})

app.listen(9999,()=>{

    console.log("server is running")

})