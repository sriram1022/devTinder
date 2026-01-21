const adminAuth = (req,res,next)=>{
    let token  = "sriram";
    let authorization  = token === "sriram";
    if(!authorization){
        res.status(401).send("not authorised")
    }
    else{
        console.log("authorisation is successfull")
        next();
    }
}
module.exports = {
    adminAuth
}