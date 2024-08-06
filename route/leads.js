const express = require("express");
const router = express.Router();
const {createLead , updateLead,getLeadsByApiKey,getLeadByLeadtype, createLeads ,deleteLeads, getAllLeads,filterLeadsByleadType,filterLeadsByInvalidLeadType, getCounts , getLeadById, filterLeadsByStatus , getLeadByObjectId} = require("../controllers/leads")
const {checkAdmin} = require("../middleware/checkAdmin");
const { authMiddleware } = require("../middleware/adminOruser");
const {extractDeviceToken} = require("../middleware/firebase")
 
router.post("/createLead",authMiddleware ,createLead );
router.post("/createLead",authMiddleware ,createLeads );
router.get("/getAllLeads" , authMiddleware ,getAllLeads );
router.get("/getLeadById" , authMiddleware ,getLeadById );
router.put("/updatelead",authMiddleware ,updateLead );
router.get("/getLeadByObjectId" , authMiddleware ,getLeadByObjectId );
router.get("/filterLeadsByStatus" , authMiddleware ,filterLeadsByStatus );
router.get("/filterLeadsByleadType" , authMiddleware ,filterLeadsByleadType );
router.get("/filterLeadsByInvalidLeadType" , authMiddleware ,filterLeadsByInvalidLeadType );
router.get("/getCounts" , authMiddleware ,getCounts );
router.delete("/deleteLead" , authMiddleware ,deleteLeads );
router.get("/getLeadsByApiKey" , authMiddleware ,getLeadsByApiKey );
router.get("/getLeadByLeadtype" , authMiddleware ,getLeadByLeadtype );

router.get('/test-token', extractDeviceToken, (req, res) => {
    res.status(200).json({
      message: 'Token validation test successful',
      user: req.user // Return user information from the token
    });
  });
module.exports = router 