const express = require('express');
const router = express.Router();

const {getNotification , updateIsExcept} = require("../controllers/notification")
const { authMiddleware } = require("../middleware/adminOruser");
router.get("/getNotification" ,authMiddleware , getNotification )
router.put("/updateIsExcept" ,authMiddleware , updateIsExcept )
module.exports = router
