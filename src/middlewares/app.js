const express = require('express');
const connectDB = require('../config/data_base'); 
const User = require('../models/user');

const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
 try{
    console.log("Received Data:", req.body);
    const user = new User(req.body);
    await user.save();
    console.log("Saved Data:", user);
    res.send("User Created Successfully");
 }catch(err){
    res.status(400).send(err);
 }                                                                              
});

app.get("/user", async (req, res) => {

   // const userId = req.body._id;
   // try{
   //   const user = await User.findById(userId);
   //   if(!user){
   //     res.send("user not found");
   //   }else{
   //     res.send(user);
   //   }
   


//   const userEmail = req.body.emailId;
//   try{
//     const user = await User.findOne({emailId:userEmail});
//     if(!user){
//       res.send("user not found");
//     }else{
//       res.send(user);
//     } 

   const users = await User.find({emailId:userEmail});
   try{
   if(users.length === 0){
     res.status(404).send("User not found");
   }
   else{
      res.send(users);
   }
  }catch(err){
   res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req, res) => {
   const userId = req.body.userId;
   try{
      const user = await User.findByIdAndDelete(userId);
      if(!user){
         res.status(404).send("User not found");
      }else{
         res.send("User deleted successfully");
      }
}catch(err){
   res.status(400).send("something went wrong");
}
});

app.patch("/user", async (req, res) => {
   const userId = req.body.userId;
   const data = req.body;
   console.log(data);
   try{
      const user = await User.findByIdAndUpdate({_id:userId}, data,{
         returnDocument: "after",
      });
      console.log(user);
      if(!user){
         res.status(404).send("User not found");
   }else{
         res.send("User updated successfully");
      }
   }catch(err){   
      res.status(400).send("something went wrong");
   }
})

app.get("/feed", async (req, res) => {
  try{
      const users = await User.find({});
      res.send(users);
  }
   catch(err){
         res.status(400).send("something went wrong");
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
