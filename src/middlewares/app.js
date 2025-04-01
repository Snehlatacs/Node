const express = require('express');
const connectDB = require('../config/data_base'); 
const app = express();
const User = require("../models/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
 const user = new User(console.log(req.body));
 try{
    await user.save();
    res.send("User Created Successfully");
 }catch(err){
    res.status(400).send(err);
 }                                                                              
});

connectDB()
.then(() => {   
    console.log('MongoDB connected successfully');
    app.listen(7777, () => {
    console.log('Server is running on port 7777');
    });
})  
.catch((err) => {   
        console.error('MongoDB connection failed:', err);
});
