const LeadSource = require('../models/leadSource');
const asyncHandler = require('express-async-handler');

// Create Lead Source
const createLeadSource = asyncHandler(async (req, res) => {
    try {
        const { leadSources } = req.body;
        const newLeadSource = new LeadSource({ leadSources });
        const leadSource = await newLeadSource.save();
        res.status(201).json(leadSource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Read All Lead Sources
const getAllLeadSources = asyncHandler(async (req, res) => {
    try {
        const leadSources = await LeadSource.find();
        res.status(200).json(leadSources);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Read Lead Source by ID
const getLeadSourceById = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query; 
        const leadSource = await LeadSource.findById(id);
        if (!leadSource) {
            return res.status(404).json({ msg: "Lead Source not found" });
        }
        res.status(200).json(leadSource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Update Lead Source
const updateLeadSource = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query; 
        const { leadSources } = req.body;
        const leadSource = await LeadSource.findByIdAndUpdate(
           id,
            { leadSources },
            { new: true, runValidators: true }
        );
        if (!leadSource) {
            return res.status(404).json({ msg: "Lead Source not found" });
        }
        res.status(200).json(leadSource);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Delete Lead Source
const deleteLeadSource = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query;
        const leadSource = await LeadSource.findByIdAndDelete(id);
        if (!leadSource) {
            return res.status(400).json({ msg: "Lead Source not found" });
        }
        res.status(200).json({ msg: "Lead Source deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = {
    createLeadSource,
    getAllLeadSources,
    getLeadSourceById,
    updateLeadSource,
    deleteLeadSource
};
