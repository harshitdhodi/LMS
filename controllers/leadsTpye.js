const leadQuality = require("../models/leadQuality");
const asyncHandler = require("express-async-handler");

const createLeadType = asyncHandler(async (req, res) => {
    try {
        const { lead_type } = req.body;
        const newLead = new leadQuality({ lead_type });
        const leadType = await newLead.save();
        res.status(201).json(leadType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Read All Lead Types
const getAllLeadTypes = asyncHandler(async (req, res) => {
    try {
        const leadTypes = await leadQuality.find();
        res.status(200).json(leadTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Read Lead Type by ID
const getLeadTypeById = asyncHandler(async (req, res) => {
    try {
        const {id} =req.query
        const leadType = await leadQuality.findById(id);
        if (!leadType) {
            return res.status(404).json({ msg: "Lead Type not found" });
        }
        res.status(200).json(leadType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Update Lead Type
const updateLeadType = asyncHandler(async (req, res) => {
    try {
        const {id} =req.query
        const { lead_type } = req.body;
        const leadType = await leadQuality.findByIdAndUpdate(
            id,
            { lead_type },
            { new: true, runValidators: true }
        );
        if (!leadType) {
            return res.status(404).json({ msg: "Lead Type not found" });
        }
        res.status(200).json(leadType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Delete Lead Type
const deleteLeadType = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query
        const leadType = await leadQuality.findByIdAndDelete(id);
        if (!leadType) {
            return res.status(404).json({ msg: "Lead Type not found" });
        }
        res.status(200).json({ msg: "Lead Type deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = {
    createLeadType,
    getAllLeadTypes,
    getLeadTypeById,
    updateLeadType,
    deleteLeadType
};