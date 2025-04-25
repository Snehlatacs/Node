const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose");

const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
   try{
    const senderId = req.user._id;
    const receiverId = req.params.userId;
    const status = req.params.status;

   
    //Status allowed to sender is only intrested and pending
    if (status !== "intrested" && status !== "pending") {
      return res.status(400).json({ message: "Invalid status. Allowed statuses are 'intrested' and 'pending'." });
    }

    // Check if the sender and receiver IDs are valid ObjectIDs 
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ message: "Invalid sender or receiver ID." });
    }
 
    // Check if the sender and receiver are valid users
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
        return res.status(404).json({ message: "Sender or receiver not found." });
    }

    // Check if the sender and receiver are the same user
    if (senderId.toString() === receiverId.toString()) {
      return res.status(400).json({ message: "You cannot send a connection request to yourself." });
    }

    // Check if the sender and receiver are already connected 
    if (status === "accepted") {
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { senderId, receiverId, status: "accepted" },
          { senderId: receiverId, receiverId: senderId, status: "accepted" }
        ]
      });
      if (existingConnection) {
        return res.status(400).json({ message: "You are already connected with this user." });
      }
    } 

    // Check if the connection request already exists 
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    });
    if (existingRequest) {
      return res.status(400).json({ message: "A connection request already exists between these users." });
    }

    // Check if the receiver is blocked by the sender
    if (sender.blockedUsers && sender.blockedUsers.includes(receiverId)) {
      return res.status(400).json({ message: "You cannot send a connection request to a blocked user." });
    }
    if (receiver.blockedUsers && receiver.blockedUsers.includes(senderId)) {
      return res.status(400).json({ message: "You cannot send a connection request to a blocked user." });
    }
   
    //create a new connection request
    const connectionRequest  = new ConnectionRequest({
      senderId,
      receiverId,
      status
    })

    const data = await connectionRequest.save();

    res.json({
      message:"Connection request sent successfully",
      data
    })

   }catch(err){
    res.status(400).send("ERROR: " + err.message);
   }
  });

module.exports  = requestRouter; 