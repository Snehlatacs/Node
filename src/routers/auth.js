const express = require("express");
const authRouter = express.Router();

const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const User = require('../models/user');

authRouter.post("/signup", async (req, res) => {
 try{
   validateSignupData(req);

   const{ firstName, lastName, emailId, password, gender, dob, skill, education} = req.body;

   const passwordHash = await bcrypt.hash(password, 10);

    console.log("Received Data:", req.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      gender,
      dob,
      skill,
      education,
      confirmPassword: passwordHash
    });
    await user.save();
    res.send("User Created Successfully");
 }catch(err){
    res.status(400).send("ERROR: " + err.message);
 }                                                                              
});

authRouter.post("/login", async (req, res) => {
    try{
    const {emailId, password} = req.body;
       
    const user = await User.findOne({emailId: emailId})
    if(!user){
       throw new Error("Invalid Credentials");
    }
 
    const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid){
       const token  = await user.getJWT();
 
       res.cookie("token", token, {expires: new Date(Date.now() + 8*3600000),});
       res.send("Login Successful!");
    }
    else 
    {
       throw new Error("Invalid Credentials");
    }
 }
 catch(err){
    res.status(400).send("ERROR: " + err.message);
 }
 });

authRouter.post("/logout", async (req, res) =>{
      res.cookie("token", null, {expires: new Date(Date.now()),});
      res.send("Logout Successful!");
});

 module.exports = authRouter;