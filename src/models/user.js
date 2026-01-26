const mongoose = require("mongoose");
 
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true,
        trim: true
    },
    emailId:{
        type: String,
        lowercase: true,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    age:{
      type:Number,
        required:true,
        min:18,
        max:100
    },
    gender:{
        type:String,
        required:true,
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender must be male ,female or other");
            }
        }
    }
},{
    timestamps:true

})

const UserModel = mongoose.model("user",userSchema);

module.exports = {
    UserModel
}

