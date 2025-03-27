const express = require("express");
const app = express();

app.use( 
"/user",
(req, res, next) => {
  console.log("Handling /user request");
  //res.send("sending third response")
  next();
},

(req, res, next) => {
  console.log("Handling /user request");
  //res.send("sending third response")
  next();
},

(req, res) => {
  console.log("Handling /user request");
  res.send("sending third response")
});

app.listen(7777, () => {
  console.log("Server is running on port 7777");
});