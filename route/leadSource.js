const express = require('express');
const router = express.Router();
const {
    createLeadSource,
    getAllLeadSources,
    getLeadSourceById,
    updateLeadSource,
    deleteLeadSource
} = require('../controllers/leadSource');
const { authMiddleware } = require("../middleware/adminOruser");
router.post("/addLeadSource" , authMiddleware ,createLeadSource )
router.get("/getAllLeadSources" , authMiddleware ,getAllLeadSources )
router.get("/getLeadSourceById" , authMiddleware ,getLeadSourceById )
router.put("/updateLeadSource" , authMiddleware ,updateLeadSource )
router.delete("/deleteLeadSource" , authMiddleware ,deleteLeadSource )

module.exports = router ;