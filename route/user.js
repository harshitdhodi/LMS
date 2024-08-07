const express = require("express");
const router = express.Router();
const {createUser , loginUser,updateAdmin,logoutUser , getAllUser,updateuser,deleteUser,getUserByUser, getUserByUserId , updateUserFields} = require("../controllers/user")
// const {authMiddleware, isAdmin} = require("../middleware/authMiddleware")
const {uploadPhoto} = require("../middleware/imageUpload")
const { authMiddleware } = require("../middleware/adminOruser");
router.post("/register" ,createUser );
router.post("/login" ,loginUser );
router.get("/getusers",authMiddleware ,getAllUser );
router.get("/getUserByUserId", authMiddleware ,getUserByUserId );
router.get("/getUserByUser", authMiddleware ,getUserByUser );
// router.put("/updateUserById",authMiddleware ,uploadPhoto ,updateAdmin );
router.put("/updateUserById",authMiddleware,uploadPhoto ,updateUserFields );
router.put("/updateAdmin",authMiddleware,uploadPhoto ,updateAdmin );
router.delete("/deleteUser",authMiddleware ,deleteUser );
router.post("/logout", logoutUser);
module.exports = router 
