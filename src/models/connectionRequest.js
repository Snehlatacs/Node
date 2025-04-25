const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        require: true,
        enum: {
            values: ["intrested", "pending", "accepted", "rejected"],
            message: "{VALUE} is not a valid status", 
        },
        default: "pending",
    },
}, { timestamps: true }
);


connectionRequestSchema.pre("save", async function (next) {
    const connectionRequest = this;
    if (connectionRequest.isModified("status")) {
        if (connectionRequest.status === "accepted") {
            connectionRequest.status = "intrested";
        }
    }
    next();
}
);

  
connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });
connectionRequestSchema.index({ status: 1 });

const ConnectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = ConnectionRequestModel;