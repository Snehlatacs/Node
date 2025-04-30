const express = require("express");
const requestRouter = express.Router();
const mongoose = require("mongoose");

const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
const { userAuth } = require("../middlewares/auth");

requestRouter.post("/request/send/:status/:userId", userAuth, async (req, res) => {
  try {
      const senderId = req.user._id;
      const receiverId = req.params.userId;
      const status = req.params.status;

      // Status allowed to sender is only "intrested" and "ignored"
      if (status !== "intrested" && status !== "ignored") {
          return res.status(400).json({ message: "Invalid status. Allowed statuses are 'intrested' and 'ignored'." });
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

      // Create a new connection request
      const connectionRequest = new ConnectionRequest({
          senderId,
          receiverId,
          status
      });

      const data = await connectionRequest.save();

      res.json({
          message: "Connection request sent successfully",
          data
      });

  } catch (err) {
      res.status(500).send("ERROR: " + err.message);
  }
});

  requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => { 
    try {
        const loggedInUserId = req.user._id; // Logged-in user's ID
        const { requestId, status } = req.params; // Extract requestId and status from route params

        // Validate the requestId
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ message: "Invalid request ID." });
        }

        const allowedStatuses = ["accepted", "rejected"]; // Allowed statuses for the connection request
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed statuses are 'accepted' and 'rejected'." });
        }

        // Find the connection request
        let connectionRequest = await ConnectionRequest.findOne({ 
            _id: requestId, // Find by requestId
            receiverId: loggedInUserId, // Ensure the logged-in user is the receiver
            status: "intrested" // Ensure the request is still pending
        });
        if (!connectionRequest) {
            return res.status(404).json({ message: "Connection request not found or already processed." });
        }

        // Update the status of the connection request
        connectionRequest.status = status; // Update the status
        const data = await connectionRequest.save(); // Save the updated connection request

        console.log("Fetched Connection Request:", connectionRequest);
        console.log("Updated Connection Request:", data);

        // Send a response
        res.json({
            message: `Connection request ${status} successfully`,
            data,
        });

    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    } 
});

module.exports  = requestRouter;