var jwt = require('jsonwebtoken');
const{UserModel} = require("../models/user");


const tokenAuth = async (req,res,next)=>{
    try{
      const cookies = req.cookies;
    //   console.log(cookies);
      const{token} = cookies;
      if(!token){
        throw new Error("token not valid");
      }
      let decodedToken = jwt.verify(token ,"secretkey");
      const {userId} = decodedToken;
      let userDetails = await UserModel.findById(userId); 
       if(!userDetails){
        throw new Error("unauthorized");
        }
       
        req.userDetails = userDetails;
         next();
         }
         catch(err){
             res.status(500).send("error in fetching  user data" + err.message)
         }
    
}
module.exports = {
    tokenAuth
}