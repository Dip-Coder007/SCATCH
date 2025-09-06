const userModel = require("../models/user-model");
const express = require("express");
const bcrypt = require("bcrypt")
const{generateToken} = require("../utils/generateToken")

module.exports.registerUser = async function(req,res){
try{
    let{ email,password,fullname } = req.body;
    let user = await userModel.findOne({email:email})
    if(user)return res.status(401).send("You already have an account")
    bcrypt.genSalt(10,function(err,salt){
        bcrypt.hash(password,salt,async function(er,hash){
      if(err) return res.send(err.message)
        else {
    let user = await userModel.create({
     email,
     password:hash, 
     fullname,
    })
    let token = generateToken(user)
    res.cookie("token",token)
    res.send("user created sucessfully");
    }
        })
    })

}
catch(err){
    console.log(err.message)
}

};
module.exports.loginUser = async function(req,res){
    let{email,password} = req.body;

    let user = await userModel.findOne({email:email})
    if(!user) {
        req.flash("error","Incorrect Email or Password")
        return res.redirect("/")
    }
    bcrypt.compare(password, user.password,function(err,result){
        if(result){
            let token = generateToken(user);
            res.cookie("token",token);
            return res.redirect("/shop");
        }
        else{
       req.flash("error","Incorrect Email or Password")
       return res.redirect("/");
        }
    })
}
module.exports.logout = async function(req,res){
res.cookie("token","")
res.redirect("/")
}
