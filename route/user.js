const express = require("express");
const router = express.Router();
const {createUser , loginUser , getAllUser,updateuser,deleteUser, getUserByUserId , updateUserFields} = require("../controllers/user")
// const {authMiddleware, isAdmin} = require("../middleware/authMiddleware")
const { authMiddleware } = require("../middleware/adminOruser");
router.post("/register" ,createUser );
router.post("/login" ,loginUser );
router.get("/getusers",authMiddleware ,getAllUser );
router.get("/getUserByUserId", authMiddleware ,getUserByUserId );
router.put("/updateUsers",authMiddleware ,updateUserFields );
router.put("/updateUserById",authMiddleware ,updateuser );
router.delete("/deleteUser",authMiddleware ,deleteUser );
module.exports = router 