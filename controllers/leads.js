const Leads = require("../models/lead");
const asyncHandler = require("express-async-handler");
const User = require("../models/user")
const StatusType = require("../models/status")
const LeadQuality = require("../models/leadQuality")
const admin = require('firebase-admin');
// Load Firebase Admin SDK credentials
const { sendNotification } = require('./sendNotification');
const Notification = require("../models/notification")
// Example usage in a route
const createLead = asyncHandler(async (req, res) => {
  try {
    const { role } = req.user;

    // Check if the role is allowed
    if (role !== 'admin' && role !== 'user') {
      return res.status(403).json({ msg: "You do not have permission to create a lead." });
    }

    const { firstname, lastname, email, mobile, companyname, leadInfo, status, leadsDetails } = req.body;
    const { id } = req.query; // User ID

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
      byLead: role,
      leadType,
      status,
      leadsDetails
    });

    const savedLead = await newLead.save();

    // Retrieve user and their device tokens
    const user = await User.findById(id).select('deviceTokens'); // Adjust to include deviceTokens field
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    const deviceTokens = user.deviceTokens;
    console.log('Device Tokens:', deviceTokens);

    let notificationResponse = null; // Variable to store the notification response

    // Send notification only if the role is admin
    if (role === 'admin' && deviceTokens && deviceTokens.length > 0) {
      const notificationData = {
        title: "New Lead Created",
        body: `A new lead for ${companyname} has been posted.`,
        tokens: deviceTokens // Send notification to all tokens
      };

      // Send notification and capture response
      notificationResponse = await sendNotification(notificationData);
    } else if (role === 'admin') {
      console.log("No device tokens found for the user.");
    }

    // Respond with the saved lead and notification data
    res.status(200).json({ savedLead, notificationResponse });
  } catch (error) {
    console.error("Error creating lead:", error);
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
        // Extract pagination parameters from query parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 5;

        // Calculate the number of documents to skip and the limit for the query
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        // Fetch leads with pagination, populate user data, and sort
        const [leads, totalLeads] = await Promise.all([
            Leads.find()
                .populate('user', 'name email API_KEY') // Adjust fields as necessary
                .sort({ createdAt: -1 }) // Sort by creation date, descending
                .skip(skip) // Skip the documents for the current page
                .limit(limit), // Limit the number of documents returned
            Leads.countDocuments() // Count the total number of documents
        ]);

        // Combine leads with user data
        const result = leads.map(lead => ({
            ...lead.toObject(),
            user: lead.user // Add user data to each lead
        }));

        // Return paginated results
        res.status(200).json({
            total: totalLeads,
            currentPage: page,
            totalPages: Math.ceil(totalLeads / pageSize),
            data: result
        });
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


// get lead based on API_KEY

const getLeadsByApiKey = async (req, res) => {

  try {
      const apiKey = req.query.apiKey; // Assuming API key is passed in the body

      if (!apiKey) {
          return res.status(400).json({ message: 'API key is required' });
      }

      // Find the user associated with the API key
      const user = await User.findOne({ API_KEY: apiKey });
console.log(user._id)
      if (!user) {
          return res.status(403).json({ message: 'Invalid API key' });
      }

      // Fetch leads associated with the user's ObjectId
      const leads = await Leads.find({ user: user._id });

      res.status(200).json(leads);
  } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createLeads = asyncHandler(async (req, res) => {
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
    res.status(200).json(savedLead);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

const getLeadByLeadtype = asyncHandler(async (req, res) => {
  const { id: tokenUserId } = req.user; // Extract the user ID from the token
  const { user } = req.query; // Get the user ID from the query parameters

  try {
    // Check if the user ID from the token matches the user ID in the query params
    if (tokenUserId.toString() !== user) {
      return res.status(403).json({ msg: "You do not have permission to access these leads." });
    }

    // Find leads where leadType is 'Genuine' and user ID matches
    const leads = await Leads.find({ leadType: 'Genuine', user: tokenUserId });

    if (!leads || leads.length === 0) {
      return res.status(404).json({ msg: 'No leads found' });
    }

    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
});


  module.exports ={createLead , updateLead,getLeadsByApiKey,createLeads ,getLeadByLeadtype , getAllLeads, deleteLeads ,filterLeadsByInvalidLeadType, filterLeadsByleadType , getLeadById, filterLeadsByStatus, getCounts , getLeadByObjectId};
