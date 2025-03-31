 const express = require("express");
 const app = express(); 

const { adminAuth, userAuth } = require("./auth.js");

app.use("/admin", adminAuth);

app.get("/user", userAuth, (req, res) => {
  res.json({ firstName: "Snehlata", lastName: "Prajapti" });
});

app.get("/admin/getAllData", (req, res) => {    
    res.json({ message: "All data fetched" });
}
);

app.get("/admin/deleteUser", (req, res) => {    
    res.json({ message: "User deleted" });
    });

app.get("/admin/updateUser", (req, res) => {
    res.json({ message: "User updated" });
});

app.listen(7777, () => {
  console.log("Server is running on port 1300");
});