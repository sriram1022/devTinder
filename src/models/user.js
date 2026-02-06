const mongoose = require("mongoose");

const validator = require("validator");
 
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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email format");
            }
        }
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    },
    age:{
      type:Number,
       
        min:18,
        max:100
    },
    gender:{
        type:String,
       
        validate(value){
            if(!["male","female","other"].includes(value)){
                throw new Error("gender must be male ,female or other");
            }
        }
    },
    skills:{
        type:[String],
        default:["javaScript","html","css"],
        validate(value){
            if(!Array.isArray(value)){
                throw new Error("skills must be an array");
            }
            //length check only allow 3 skills
            if(value.length<1){
                throw new Error("atleast one skill is required");
            }
            if(value.length>3){
                throw new Error("maximum 3 skills are allowed");
            }

        }

    },
    photo:{
        type :"String",
        default:"https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png",

    }
},{
    timestamps:true

})

const UserModel = mongoose.model("user",userSchema);

module.exports = {
    UserModel
}

