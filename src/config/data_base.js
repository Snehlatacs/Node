const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(
     "mongodb+srv://snehcs70:QUy4d6SmR7KmSkmV@sneh70.ci1cc.mongodb.net/devTinder",
    );
}; 

module.exports = connectDB;




