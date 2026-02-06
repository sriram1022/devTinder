const mongoose = require("mongoose");

const ConnectonRequestSchema = new mongoose.Schema({
             fromUserId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user",
                required:true
             },
             toUserId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user",
                required:true
             },
             status:{
                type: String,
                required:true,
                enum:{
                    values:["ignored","interested","accepted","rejected"],
                    message:`{VALUE}is incorrect status type`
                }
             }
},{
    timestamps:true,
})
ConnectonRequestSchema.pre("save",function (){
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('cannot send connection request to yourself')
    }
})


const connectionRequestModel = mongoose.model("connection",ConnectonRequestSchema);

module.exports = {connectionRequestModel};