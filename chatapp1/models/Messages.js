const mongoose=require("mongoose");

const MessageSchema= new mongoose.Schema({
  sender: {type:String,trim:true,require:true},
  message: {type:String,trim:true,require:true},
  room: {type:String,trim:true,require:true},
  createdAt:{type:Date,default:Date.now()},
});




module.exports =mongoose.model('Message', MessageSchema);