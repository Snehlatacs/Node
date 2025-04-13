const express = require("express");
const profileRouter = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");


const User = require('../models/user');
const { userAuth } = require("../middlewares/auth");
const { validateProfileUpdates } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
       const user = req.user;
       res.send(user);
       
    }catch(err){
          res.status(400).send("ERROR: " + err.message);
       }
});

profileRouter.put("/profile/update", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const updates = Object.keys(req.body);

        validateProfileUpdates(updates);

        updates.forEach((update) => (user[update] = req.body[update]));
        await user.save();
        res.send(user);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

profileRouter.post("/forgot-password", async (req, res) => {
    try {
        const { emailId } = req.body;

        // Check if the user exists
        const user = await User.findOne({ emailId });
        if (!user) {
            return res.status(404).send({ error: "User not found with this email" });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Save the reset token and its expiration in the user's document
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
        await user.save();

        // Send the reset token via email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your-email@gmail.com", // Replace with your email
                pass: "your-email-password", // Replace with your email password or app password
            },
        });

        const resetUrl = `http://localhost:7777/reset-password/${resetToken}`;
        const mailOptions = {
            to: user.emailId,
            subject: "Password Reset Request",
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.send({ message: "Password reset link sent to your email" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

profileRouter.post("/reset-password/:token", async (req, res) => {
    try {
        const { token } = req.params;
        const { password, confirmPassword } = req.body;

        // Hash the token and find the user
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure the token is not expired
        });

        if (!user) {
            return res.status(400).send({ error: "Invalid or expired token" });
        }

        // Validate passwords
        if (password !== confirmPassword) {
            return res.status(400).send({ error: "Passwords do not match" });
        }

        // Update the user's password
        user.password = await bcrypt.hash(password, 10);
        user.confirmPassword = user.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.send({ message: "Password reset successful" });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = profileRouter;