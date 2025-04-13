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

// app.get("/user", async (req, res) => {

//    // const userId = req.body._id;
//    // try{
//    //   const user = await User.findById(userId);
//    //   if(!user){
//    //     res.send("user not found");
//    //   }else{
//    //     res.send(user);
//    //   }
   


// //   const userEmail = req.body.emailId;
// //   try{
// //     const user = await User.findOne({emailId:userEmail});
// //     if(!user){
// //       res.send("user not found");
// //     }else{
// //       res.send(user);
// //     } 

//    const users = await User.find({emailId:userEmail});
//    try{

//    if(users.length === 0){
//      res.status(404).send("User not found");
//    }
//    else{
//       res.send(users);
//    }
//   }catch(err){
//    res.status(400).send("something went wrong");
//   }
// });

// app.delete("/user", async (req, res) => {
//    const userId = req.body.userId;
//    try{
//       const user = await User.findByIdAndDelete(userId);
//       if(!user){
//          res.status(404).send("User not found");
//       }else{
//          res.send("User deleted successfully");
//       }
// }catch(err){
//    res.status(400).send("something went wrong");
// }
// });

// app.patch("/user/:userId", async (req, res) => { 
//    const userId = req.params.userId;
//    const data = req.body;
//    console.log("Updated Data: ", data);
//    try{
//       const ALLOWED_UPDATE = [
//          "userId",
//          "photoURL",
//          "password",
//          "about",
//          "gender",
//          "dob",
//          "age",
//          "skills",
//       ];
//       const isUpdateAllowed = Object.keys(data).every((k)=>
//          ALLOWED_UPDATE.includes(k)
//       );
//       if(!isUpdateAllowed){
//          res.status(400).send("Update not Allowed");
//       }

//       if (data.password) {
//          data.password = await bcrypt.hash(data.password, 10);
//       }

//       const user = await User.findByIdAndUpdate(userId, data,{
//          new: true,
//          runValidators: true,
//       });

//       console.log(user);

//       if(!user){
//          res.status(404).send("User not found");
//       }
//       const formattedUser = {
//          _id: user._id,
//          firstName: user.firstName,
//          lastName: user.lastName,
//          emailId: user.emailId,
//          password: user.password,
//          dob: user.dob,
//          gender: user.gender,
//          profilePic: user.profilePic,
//          bio: user.bio,
//          isVerified: user.isVerified,
//          isDeleted: user.isDeleted,
//          isBlocked: user.isBlocked,
//          createdAt: user.createdAt,
//          updatedAt: user.updatedAt,
//          __v: user.__v,
//       };

//       res.send(formattedUser);

//    }catch(err){   
//       res.status(400).send("Update fail " + err.message);
//    }
// });

// app.get("/feed", async (req, res) => {
//   try{
//       const users = await User.find({});
//       res.send(users);
//   }
//    catch(err){
//          res.status(400).send("something went wrong");
//    }
// });
