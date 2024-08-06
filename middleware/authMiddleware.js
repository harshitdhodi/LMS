const User = require("../models/user");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
                console.log(decoded)
                // req.user = await User.findById(decoded.id).select("password");
                next();
            }
        } catch (error) {
            res.status(401).json({ msg: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ msg: "Not authorized, no token" });
    }
});


//for Admin

const isAdmin = asyncHandler( 
    async ( req , res , next) => {
        const {email} = req.user;
        const adminUser = await User.findOne({email});
        if(adminUser.role !== "admin"){
            throw new Error("You are not an Admin")
        }else{
            next()
        }
    }
)

module.exports = {authMiddleware , isAdmin}