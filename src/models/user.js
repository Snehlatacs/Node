const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        minLength:3,
        maxLength:50,
    },
    lastName:{
        type: String,
        maxLength:50,
    },
    emailId:{
        type:String,
        lowercase:true,
        required:true,
        unique:true,
        trim:true,
        validator: function(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email Id");
            }
        }
    },
    password:{
        type: String,
        required:true,
        validator:function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    dob:{   
        type: Date,
        required:true,
        validate: function(value){
            if(!validator.isDate(value)){
                throw new Error("Invalid Date of Birth");
            }
        }
    }, 
    gender: {
        type: String,
        required:true,
        validate(value){
          if(!["male","female","other"].includes(value)){
            throw new Error("not valid gender");
          }
        }
    },
    profilePic:{
        type: String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-978409_1280.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL for profile picture");
            }
        }
    },
    bio:{
        type: String,
        maxLength: 500,
        default:"Hey there! I am using this app",
        validate(value){
            if(!validator.isLength(value, { max: 500 })){
                throw new Error("Bio should be less than 500 characters");
            }
        }
    },
    phone:{
        type: String,
        validate(value){
            if(!validator.isMobilePhone(value, 'any', { strictMode: false })){
                throw new Error("Invalid Phone Number");
            }
        }
    },
    address:{
        type: String,
        validate(value){
            if(!validator.isLength(value, { max: 100 })){
                throw new Error("Address should be less than 100 characters");
            }
        }
    },  
    isVerified:{
        type: Boolean,
        default: false,
    },
    isDeleted:{
        type: Boolean,
        default: false,
    },
    isBlocked:{
        type: Boolean,
        default: false,
    }
},
{
    timestamps:true,
}
);

module.exports = mongoose.model('User', userSchema);