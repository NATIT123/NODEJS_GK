const getindex=(req,res)=>{    
    res.render("index",{username:req.session.username,_id:req.session.remember});
}

const getlogin=(req,res)=>{
    res.render("login",{message:req.session.flash,type:req.session.type,_id:req.session.remember});
}

const getregister=(req,res)=>{
    res.render("register",{message:req.session.message,type:req.session.type});
}

const logout=(req,res)=>{
    res.redirect("/login");
}

module.exports={getindex,getlogin,getregister,logout}