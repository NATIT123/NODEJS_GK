const express=require("express");
const router=express.Router();
const{getindex,getlogin,getregister,logout}=require("../controllers/homeController");


router.get("/",getlogin,);
router.get("/home",getindex);
router.get("/login",getlogin);
router.get("/register",getregister);
router.get("/logout",logout);






module.exports=router;