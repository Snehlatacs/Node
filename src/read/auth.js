const adminAuth = (req, res, next) =>{
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorization = token === "xyz" 
    if(!isAdminAuthorization){ 
        res.status(401).send("Unauthorized access");
    }else{
        next();
    }
};

const userAuth = (req, res, next) =>{
    console.log("Admin auth is getting checked");
    const token = "xyz";
    const isAdminAuthorization = token === "xyz" 
    if(!isAdminAuthorization){ 
        res.status(401).send("Unauthorized access");
    }else{
        next();
    }
};

module.exports = {
    adminAuth,
    userAuth
};