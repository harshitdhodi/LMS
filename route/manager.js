const express = require("express");
const router = express.Router();

const {createManager,getManagerById, deletemanager,updateManager , getManagerByUserId} = require("../controllers/manager")
const { authMiddleware } = require("../middleware/adminOruser");
router.post("/addManager" ,authMiddleware,createManager )
router.get("/getManager",authMiddleware ,getManagerByUserId )
router.delete("/deleteManager",authMiddleware ,deletemanager )
router.put("/updateManager",authMiddleware ,updateManager )
router.get("/getManagerById",authMiddleware ,getManagerById )
module.exports = router