const mongoose=require("mongoose");

const SchemaUser= new mongoose.Schema({
  username: {type:String,trim:true,require:true},
  email: {type:String,trim:true,require:true},
  fullname: {type:String,trim:true,require:true},
  avatar: {type:String,trim:true,require:true},
  password: {type:String,trim:true,require:true},
  createdAt:{type:Date,default:Date.now()},
});




module.exports =mongoose.model('User', SchemaUser);