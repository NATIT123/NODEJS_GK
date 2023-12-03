const express=require("express");
require("dotenv").config();
const SESSION_SECRET=process.env.key;
const URL=process.env.URL;
var cookieParser = require('cookie-parser');
const handlebars=require("express-handlebars");
var session = require('express-session');
const MongoStore = require('connect-mongo')
var cookieParser = require("cookie-session");
const req = require("express/lib/request");
const configViewEngine=(app)=>{
    app.engine("hbs",handlebars.engine({
        defaultLayout:"main",extname:'.hbs',
            
    }));
    app.set("view engine","hbs");
    app.use(express.static("./public"));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.set('trust proxy', 1);
    app.use(session({
        signed:false,
        cookie:{maxAge:1800000},
        secret: 'NguyenANhTu123',
        saveUninitialized:false,
        resave:false,
        store: MongoStore.create({ mongoUrl: process.env.URL})
    }))
    // app.use(cookieParser("secert"));
}
module.exports=configViewEngine;
