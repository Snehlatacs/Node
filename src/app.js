const express = require('express');
const app = express();

app.use("/ho",(req, res) =>{
    res.send("hello from sneha")
 });

app.use("/test",(req, res) =>{
   res.send("hello from the test")
});

app.listen(1300, ()=>{
    console.log('Server is running on port 1300');
});