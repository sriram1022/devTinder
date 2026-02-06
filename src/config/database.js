const mongoose = require("mongoose")


const connectionDb = async ()=>{
    await mongoose.connect("mongodb+srv://Sriramkorla:sriram10@namstheynode.9o3czoo.mongodb.net/devtinder");

}
module.exports={connectionDb}

