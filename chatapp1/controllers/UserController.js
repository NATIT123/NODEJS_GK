const Users=require("../models/User");
require("dotenv").config();
const mongoose = require('mongoose');
const multer=require("multer");
const bcrypt = require('bcrypt');
const saltRounds = process.env.SALT;
const{mutipleMongooseToObject,mongooseToObject}=require("../public/JS/mongoose.js");

var storage=multer.diskStorage({
    destination:function(req,file,cb,res){
        if(file.mimetype==="image/jpg"|| file.mimetype==="image/jpeg"||file.mimetype==="image/png"){
            cb(null,"public/Image/avatar");
        }
        else{
            cb(new Error("Not image"),false);
        }
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
});


const upload=multer({storage:storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
});

const processlogin=(req,res,next)=>{
    var username=req.body.username;
    var password=req.body.password;
    if(username==""||password==""){
        req.session.flash="Please fill all the filed";
        req.session.type="danger";
        res.redirect("/login");
    }
    Users.findOne({username:username}).then(user=>{
        var users=mongooseToObject(user);
        if(users){
            bcrypt.compare(password, users.password, function(err, result) {
                if(result){
                    try{
                        req.session.username=username;
                        req.session.remember=users._id;
                        req.session.image=users.avatar;
                        res.redirect("/home");
                    }catch(error){
                        return next(error);
                    }
                }
                else{
                    req.session.flash="UserName or Password is incorrect";
                    req.session.type="danger";
                    res.redirect("/login");
                }
            });
        }
        else{
            req.session.flash="UserName or Password is incorrect";
            req.session.type="danger";
            res.redirect("/login");
        }
    })
};

const processregister=(req,res,next)=>{
    var email=req.body.email;
    var fullname=req.body.name;
    var _password=req.body.password;
    var confirmpass=req.body.confirm;
    if(_password!=confirmpass){
        req.session.flash="Password and Confirm Password should be the same";
        req.session.type="danger";
        res.redirect("/register");
    }
    Users.findOne({email:email}).then(user=>{
        var users=mongooseToObject(user);
        if(users){
            req.session.flash="User with given email already Exist!";
            req.session.type="danger";
            res.redirect("/register");
        }
    });
    const file=req.file;
    if(!file){
        const error=new Error("Please upload a file");
        return next(error);
    }
        try{
        const email=req.body.email;
        const username=email.substring(0,email.indexOf("@"));
        bcrypt.hash(_password, Number(saltRounds), function(err, hash) {
        const user=new Users({
            username:username,
            email:email,
            fullname:fullname,
            avatar:req.file.filename,
            password:hash
        })
        user.save().then(result=>{
            req.session.flash="Register Successfully";
            req.session.type="success";
            res.redirect("/login");
        }).catch(err=>{
            req.session.flash=err.message;
            req.session.type="danger";
            res.redirect("/register");
        });
    })
    }catch(error){
        console.log(error);
        return next(error);
    }
};


const getprofile=(req,res)=>{
    const id=mongoose.Types.ObjectId.isValid(req.params.id)?new mongoose.Types.ObjectId(req.params.id):req.params.id;
    Users.findById(id).then(user=>{
        console.log(user);
        res.render("profile",{users:mongooseToObject(user),image:user.avatar})
    })
}
const insertmessage=(req,res)=>{
    
}

module.exports={processlogin,upload,processregister,insertmessage,getprofile}