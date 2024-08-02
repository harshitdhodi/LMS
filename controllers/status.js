const StatusType = require('../models/status');
const asyncHandler = require('express-async-handler');

// Create Status Type
const createStatusType = asyncHandler(async (req, res) => {
    try {
        const { status_type } = req.body;
        const newStatusType = new StatusType({ status_type });
        const statusType = await newStatusType.save();
        res.status(201).json(statusType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Read All Status Types
const getAllStatusTypes = asyncHandler(async (req, res) => {
    try {
        const statusTypes = await StatusType.find();
        res.status(200).json(statusTypes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Read Status Type by ID
const getStatusTypeById = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query;
        const statusType = await StatusType.findById(id);
        if (!statusType) {
            return res.status(404).json({ msg: "Status Type not found" });
        }
        res.status(200).json(statusType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Update Status Type
const updateStatusType = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query;
        const { status_type } = req.body;
        const statusType = await StatusType.findByIdAndUpdate(
           id,
            { status_type },
            { new: true, runValidators: true }
        );
        if (!statusType) {
            return res.status(404).json({ msg: "Status Type not found" });
        }
        res.status(200).json(statusType);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Delete Status Type
const deleteStatusType = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query;
        const statusType = await StatusType.findByIdAndDelete(id);
        if (!statusType) {
            return res.status(404).json({ msg: "Status Type not found" });
        }
        res.status(200).json({ msg: "Status Type deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = {
    createStatusType,
    getAllStatusTypes,
    getStatusTypeById,
    updateStatusType,
    deleteStatusType
};
