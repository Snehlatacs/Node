require("dotenv").config();
const express = require('express');
const connectDB = require('./config/data_base'); 


const validator = require('validator');
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require("./routers/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
.then(() => {   
    console.log('MongoDB connected successfully');
    app.listen(7777, () => {
    console.log('Server is running on port 7777');
    });
})  
.catch((err) => {   
        console.error('MongoDB connection failed:', err.message);
});