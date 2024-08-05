const Leads = require("../models/lead");
const asyncHandler = require("express-async-handler");
const User = require("../models/user")
const StatusType = require("../models/status")
const LeadQuality = require("../models/leadQuality")

const createLead = asyncHandler(async (req, res) => {
  try {
    // The authMiddleware should have already set req.user
    const { role } = req.user;
    console.log(role);

    // Check if the user has the appropriate role
    if (role !== 'admin' && role !== 'user') {
      return res.status(403).json({ msg: "You do not have permission to create a lead." });
    }

    const { firstname, lastname, email, mobile, companyname, leadInfo, status, leadsDetails } = req.body;
    const { id } = req.user;

    // Determine the leadType based on the user's role
    const leadType = role === 'user' ? 'Genuine' : null;

    // Create and save the new lead
    const newLead = new Leads({
      firstname,
      lastname,
      email, 
      mobile,
      companyname,
      leadInfo,
      user: id,
      byLead: role, // Assign role based on the logged-in user's role
      leadType, // Set leadType based on the user's role
      status,
      leadsDetails
    });

    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

  const updateLead = asyncHandler(async (req, res) => {
    const { id } = req.query; // Assuming the lead ID is passed as a URL parameter
    const updates = req.body; // The fields to update are passed in the request body
  
    try {
      // Extract user information from req.user (set by authMiddleware)
      const { username, role } = req.user;
  
      // Find the lead
      const lead = await Leads.findById(id);
      if (!lead) {
        return res.status(404).json({ msg: 'Lead not found' });
      }
  
      // Update only the provided fields
      for (const key in updates) {
        if (updates.hasOwnProperty(key) && lead[key] !== undefined) {
          lead[key] = updates[key];
        }
      }
  
      // Update the 'updatedBy' field with username and role
      lead.updatedBy = {
        username: username,
        role: role
      };
  
      // Set the 'byLead' field based on user role
      lead.byLead = role === 'admin' ? 'admin' : 'user';
  
      await lead.save();
  
      // Return the updated fields along with 'updatedBy'
      const updatedFields = { updatedBy: lead.updatedBy, byLead: lead.byLead };
      for (const key in updates) {
        if (updates.hasOwnProperty(key)) {
          updatedFields[key] = lead[key];
        }
      }
  
      res.status(200).json({
        message: 'Lead updated successfully',
        data: updatedFields,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  });

  const getAllLeads = asyncHandler(async (req, res) => {
    try {
        // Fetch all leads from the database and populate user data
        const leads = await Leads.find()
            .populate('user', 'name email') // Adjust fields as necessary
            .sort({ createdAt: -1 }); // Sort by creation date, descending

        // Combine leads with user data
        const result = leads.map(lead => ({
            ...lead.toObject(),
            user: lead.user // Add user data to each lead
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Fetch a lead by ID
const getLeadById = asyncHandler(async (req, res) => {
  const user = req.query;

  try {
    const leads = await Leads.find(user);
    // console.log(leads);

    if (!leads || leads.length === 0) {
      return res.status(404).json({ msg: 'No leads found' });
    }

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

const getLeadByObjectId = asyncHandler(async (req, res) => {
  const {id} = req.query;

  try {
    const leads = await Leads.findById(id);
    // console.log(leads);

    if (!leads || leads.length === 0) {
      return res.status(404).json({ msg: 'No leads found' });
    }

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});

//filter data based on status 

const filterLeadsByStatus = async (req, res) => {
  const { status } = req.query;

  try {
    // Fetch all valid statuses from the database
    const validStatuses = await StatusType.find().distinct('status_type');

    // Ensure status is valid
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Filter leads by status
    const filteredLeads = await Leads.find({ status });
    
    res.status(200).json({
      success: true,
      data: filteredLeads
    });
  } catch (error) {
    console.error('Error filtering leads by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering leads'
    });
  }
};

const getCounts = async (req, res) => {
  try {
    // Extract the user ID from the query parameters
    const { user } = req.query;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Count documents in the Leads collection where the userId matches the provided ID
    const totalLeads = await Leads.countDocuments({ user });

    // Send response with the total leads count
    res.status(200).json({
      success: true,
      data: {
        totalLeads
      }
    });
  } catch (error) {
    console.error('Error counting documents:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting documents'
    });
  }
};


const deleteLeads = asyncHandler(async (req, res) => {
  try {
      const {id} = req.query;
      const Lead = await Leads.findByIdAndDelete(id);
      if (!Lead) {
          return res.status(400).json({ msg: "Leads not found" });
      }
      res.status(200).json({ msg: "Leads deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error", error: error.message });
  }
});


const filterLeadsByleadType = async (req, res) => {
  const { leadType } = req.query;
console.log(leadType)
  try {
    // Fetch all valid statuses from the database
    const validStatuses = await LeadQuality.find().distinct('lead_type');
console.log(validStatuses)
    // Ensure status is valid
    if (!validStatuses.includes(leadType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Filter leads by status
    const filteredLeads = await Leads.find({ leadType });
    
    res.status(200).json({
      success: true,
      data: filteredLeads
    });
  } catch (error) {
    console.error('Error filtering leads by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering leads'
    });
  }
};

const filterLeadsByInvalidLeadType = async (req, res) => {
  try {
    // Fetch all valid lead types from the LeadQuality schema
    const validLeadTypes = await LeadQuality.find().distinct('lead_type');
    console.log('Valid lead types:', validLeadTypes);

    // Fetch leads with leadType not in the validLeadTypes array
    const invalidLeadTypes = await Leads.find({
      leadType: { $nin: validLeadTypes }
    });

    res.status(200).json({
      success: true,
      data: invalidLeadTypes
    });
  } catch (error) {
    console.error('Error filtering leads by invalid lead type:', error);
    res.status(500).json({
      success: false,
      message: 'Error filtering leads'
    });
  }
};


  module.exports ={createLead , updateLead , getAllLeads, deleteLeads ,filterLeadsByInvalidLeadType, filterLeadsByleadType , getLeadById, filterLeadsByStatus, getCounts , getLeadByObjectId};
