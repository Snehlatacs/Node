const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: "Confirm password must match the password",
        },
    },

    skill:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isLength(value, { max: 100 })){
                throw new Error("Skill should be less than 100 characters");
            }
        }
    },

    education:{
        type: String,
        required:true,
        validate(value){
            if(!validator.isLength(value, { max: 100 })){
                throw new Error("Education should be less than 100 characters");
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
            if(!validator.isMobilePhone(value, 'any', { strictMode: true })){
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
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
},
{
    timestamps:true,
},);

userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({_id: user._id}, "DEV$Tinder@2023", {expiresIn: "8h"});

    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser , passwordHash);

    return isPasswordValid;
}
module.exports = mongoose.model('User', userSchema);