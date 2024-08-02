const express = require('express');
const router = express.Router();
const {
    createStatusType,
    getAllStatusTypes,
    getStatusTypeById,
    updateStatusType,
    deleteStatusType
} = require('../controllers/status');
const { authMiddleware } = require("../middleware/adminOruser");
router.post("/addStatus", authMiddleware , createStatusType )
router.get("/getAllStatus", authMiddleware , getAllStatusTypes )
router.get("/getStatusTypeById", authMiddleware , getStatusTypeById )
router.put("/updateStatusType", authMiddleware , updateStatusType )
router.delete("/deleteStatus", authMiddleware , deleteStatusType )

module.exports = router