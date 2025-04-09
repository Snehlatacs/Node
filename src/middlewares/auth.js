const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) =>{
    try{
    
    const {token} = req.cookies;
    if(!token){
       throw new Error("Authentication Required");
    }
    
    const decoded = jwt.verify(token, "DEV$Tinder@2023", {expiresIn: "8h"});
    
    const { _id } = decoded;
 
    const user = await User.findById(_id);
    if(!user){
       throw new Error("User not Found");
    }

    req.user = user;
    next();
}
    catch(err){
        res.status(400).send("Unauthorized: " + err.message);
    }
};

module.exports = {
    userAuth,
};