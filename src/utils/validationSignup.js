const validator = require("validator")


const validationSignup = (data)=>{

if(data.firstName.length<3 || data.firstName.length>30){
    throw new Error("first name must be between 3 to 30 characters")
}
else if(data.lastName.length<3 || data.lastName.length>30){
    throw new Error("last name must be between 3 to 30 characters")
}
else if(!validator.isEmail(data.emailId)){
    throw new Error("invalid email format")     
}
else if(!validator.isStrongPassword(data.password,{
    minLength:6,
    minLowercase:1,
    minUppercase:1,
    minNumbers:1,
    minSymbols:1
})){
    throw new Error("password must be strong")
}
}

module.exports={validationSignup}