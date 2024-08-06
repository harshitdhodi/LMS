const express = require('express');
const router = express.Router();

const {getNotification} = require("../controllers/notification")
const { authMiddleware } = require("../middleware/adminOruser");
router.get("/getNotification" ,authMiddleware , getNotification )

module.exports = router