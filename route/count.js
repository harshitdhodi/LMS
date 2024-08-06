const express = require('express');
const router = express.Router();

const {getCounts , getLeadCount} = require("../controllers/dashboard")

router.get("/allCount" , getCounts)
router.get("/getLeadCount" , getLeadCount)

module.exports = router;