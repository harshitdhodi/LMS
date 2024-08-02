const express = require("express");
const router = express.Router();
const {createLead , updateLead ,deleteLeads, getAllLeads,filterLeadsByleadType,filterLeadsByInvalidLeadType, getCounts , getLeadById, filterLeadsByStatus , getLeadByObjectId} = require("../controllers/leads")
const {checkAdmin} = require("../middleware/checkAdmin");
const { authMiddleware } = require("../middleware/adminOruser");

 
router.post("/createLead",authMiddleware ,createLead );
router.get("/getAllLeads" , authMiddleware ,getAllLeads );
router.get("/getLeadById" , authMiddleware ,getLeadById );
router.put("/updatelead",authMiddleware ,updateLead );
router.get("/getLeadByObjectId" , authMiddleware ,getLeadByObjectId );
router.get("/filterLeadsByStatus" , authMiddleware ,filterLeadsByStatus );
router.get("/filterLeadsByleadType" , authMiddleware ,filterLeadsByleadType );
router.get("/filterLeadsByInvalidLeadType" , authMiddleware ,filterLeadsByInvalidLeadType );
router.get("/getCounts" , authMiddleware ,getCounts );
router.delete("/deleteLead" , authMiddleware ,deleteLeads );

module.exports = router 