const express=require("express");
const router=express.Router();
const{processlogin,processregister,upload,getprofile}=require("../controllers/UserController");

router.post("/login",processlogin);
router.post("/register",upload.single("avatar"),processregister);

router.get("/profile/:id",getprofile);



module.exports=router;