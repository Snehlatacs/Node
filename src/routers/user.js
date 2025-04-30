const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");    
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user');
const SAFE_USER_FIELDS = "firstName lastName dob profilePic bio skill"; // Define the fields you want to expose

userRouter.get('/user/requests/recieved', userAuth, async (req, res) => {
    try {
        const userId = req.user._id; // Assuming you have the user ID from the authentication middleware

        // Find all connection requests where the user is the receiver
        const connectionRequests = await ConnectionRequest.find({ receiverId: userId, status: "interested", })
            .populate("senderId", SAFE_USER_FIELDS) // Populate senderId with name and email fields

        res.json({
            message: "Connection requests retrieved successfully",
            data: connectionRequests,
        });
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUserId= req.user._id; // Assuming you have the user ID from the authentication middleware

        // Find all connection requests where the user is the sender or receiver and status is "accepted"
        const connections = await ConnectionRequest.find({
            $or: [
                { senderId: loggedInUserId, status: "accepted" },
                { receiverId: loggedInUserId, status: "accepted" }
            ]
        })
            .populate("senderId", SAFE_USER_FIELDS) // Populate senderId with name and email fields
            .populate("receiverId", SAFE_USER_FIELDS) // Populate receiverId with name and email fields

            const data = connections.map((row) => {
                if (row.senderId._id.toString() === loggedInUserId.toString()) {
                    return {
                        ...row.receiverId._doc,
                        status: row.status,
                    };
                } else {
                    return {
                        ...row.senderId._doc,
                        status: row.status,
                    };
                }
            }
            );

        res.json({
            message: "Connections retrieved successfully",
            data
        });
    } catch (err) {
        res.status(500).send("ERROR: " + err.message);
    }
}
);

userRouter.get('/user/feed', userAuth, async (req, res) => {    
    try {
       const loggedInUserId= req.user; // Assuming you have the user ID from the authentication middleware

       let page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
       let limit = parseInt(req.query.limit) || 10; // Get the limit from the query parameters
       limit = limit > 100 ? 100 : limit; // Set a maximum limit to prevent overloading the server
       page = page < 1 ? 1 : page; // Ensure the page number is at least 1
       const skip = (page - 1) * limit; // Calculate the number of documents to skip

       const connectionRequests = await ConnectionRequest.find({ 
            $or: [
                { senderId: loggedInUserId._id},
                { receiverId: loggedInUserId._id}
            ]
        }).select("senderId receiverId");

        const hideUsersfromfeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersfromfeed.add(req.senderId.toString());
            hideUsersfromfeed.add(req.receiverId.toString());
        });

        const users = await User.find({
            $and:[ 
                {_id: { $nin: Array.from(hideUsersfromfeed) } },
                {_id: { $ne: loggedInUserId._id }},
            ],
           })
           .select(SAFE_USER_FIELDS)
           .skip(skip) // Skip the documents based on the page number
           .limit(limit); // Limit the number of documents returned


        res.json({data: users, message: "Users get feed successfully"});

    } catch (err) {
        res.status(400).send("ERROR: " + err.message);
    }
}   
);

module.exports = userRouter;