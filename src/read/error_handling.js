const express = require("express");

const app = express();

app.get("/getUserData", (req, res)=>{
   throw new Error("This is an error");
   res.send("user data sent");
});

app.use("/", (err, req, res, next)=>{
    if(err){
        res.status(500).send("Internal server error");
    }
});

app.listen(7777, ()=>{
    console.log("Server is running on port 7777");
});