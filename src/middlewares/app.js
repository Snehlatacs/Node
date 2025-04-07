const express = require('express');
const connectDB = require('../config/data_base'); 
const User = require('../models/user');
const { validateSignupData } = require('../utils/validation');
const bcrypt = require('bcrypt');
const validator = require('validator');


const app = express();
app.use(express.json());


app.post("/signup", async (req, res) => {
 try{
   validateSignupData(req);

   const{ firstName, lastName, emailId, password} = req.body;

   const passwordHash = await bcrypt.hash(password, 10);
   console.log("Hashed Password:", passwordHash);

    console.log("Received Data:", req.body);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    console.log("Saved Data:", user);
    res.send("User Created Successfully");
 }catch(err){
    res.status(400).send("ERROR: " + err);
 }                                                                              
});

app.post("/login", async (req, res) => {
   try{
   const {emailId, password} = req.body;
      
   const user = await User.findOne({emailId: emailId})
   if(!user){
      throw new Error("Invalid Credentials");
   }

   const isPasswordValid = await bcrypt.compare(password, user.password);
   if(isPasswordValid){
      res.send("Login Successful!");
   }
   else 
   {
      throw new Error("Invalid Credentials");
   }
}
catch(err){
   res.status(400).send("ERROR: " + err);
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

app.patch("/user/:userId", async (req, res) => { 
   const userId = req.params.userId;
   const data = req.body;
   console.log("Updated Data: ", data);
   try{
      const ALLOWED_UPDATE = [
         "userId",
         "photoURL",
         "password",
         "about",
         "gender",
         "dob",
         "age",
         "skills",
      ];
      const isUpdateAllowed = Object.keys(data).every((k)=>
         ALLOWED_UPDATE.includes(k)
      );
      if(!isUpdateAllowed){
         res.status(400).send("Update not Allowed");
      }

      if (data.password) {
         data.password = await bcrypt.hash(data.password, 10);
      }

      const user = await User.findByIdAndUpdate(userId, data,{
         new: true,
         runValidators: true,
      });

      console.log(user);

      if(!user){
         res.status(404).send("User not found");
      }
      const formattedUser = {
         _id: user._id,
         firstName: user.firstName,
         lastName: user.lastName,
         emailId: user.emailId,
         password: user.password,
         dob: user.dob,
         gender: user.gender,
         profilePic: user.profilePic,
         bio: user.bio,
         isVerified: user.isVerified,
         isDeleted: user.isDeleted,
         isBlocked: user.isBlocked,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
         __v: user.__v,
      };

      res.send(formattedUser);

   }catch(err){   
      res.status(400).send("Update fail " + err.message);
   }
});

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
