const express = require("express");
const requestRouter = express.Router();

const User = require('../models/user');
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/sendConnectRequest", userAuth, async (req, res) => {
    const user = req.user;
  
    console.log("Sending a connection request");
  
    res.send(user.firstName + " sent Connection request !!");
  });

module.exports  = requestRouter; 