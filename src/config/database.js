const mongoose = require("mongoose")


const connectionDb = async ()=>{
    await mongoose.connect("mongodb+srv://Sriramkorla:Sriram10@namstheynode.9o3czoo.mongodb.net/userData");

}
module.exports={connectionDb}

