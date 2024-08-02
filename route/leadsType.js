const express = require("express");
const router = express.Router();

const {createLeadType ,   getAllLeadTypes,
    getLeadTypeById,
    updateLeadType,
    deleteLeadType} = require("../controllers/leadsTpye");
const { authMiddleware } = require("../middleware/adminOruser");
router.post("/addLeadType" ,authMiddleware, createLeadType)
router.get("/getAllLeadTypes" ,authMiddleware, getAllLeadTypes)
router.get("/getLeadTypeById" ,authMiddleware, getLeadTypeById)
router.put("/updateLeadType" ,authMiddleware, updateLeadType)
router.delete("/deleteLeadType" ,authMiddleware, deleteLeadType)
module.exports = router;    