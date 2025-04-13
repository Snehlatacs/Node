const validator = require("validator");
const validateSignupData = (req) =>{
    const {firstName, lastName, emailId, password} = req.body;

    if(!(firstName || lastName)){
        throw new Error("Name is not valid");
    }
    else if(!validator.isEmail(emailId)){
        throw new error("Email is not valid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new error("Please enter strong password");
    }
};

const validateProfileUpdates = (updates) => {
    const allowedUpdates = [
        "firstName",
        "lastName",
        "email",
        "dob",
        "skill",
        "education",
        "experience",
        "profilePic",
        "bio",
        "gender",
        "phone",
        "address",
    ];

    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        throw new Error("Invalid updates!");
    }
};

module.exports = { 
    validateSignupData,
    validateProfileUpdates
};
