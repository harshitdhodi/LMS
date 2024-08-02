// controllers/countController.js
const LeadsData = require('../models/lead');
const Customer = require('../models/user');
const Status = require("../models/status")
const getCounts = async (req, res) => {
  try {
    // Count documents in LeadsData collection
    const leadsDataCount = await LeadsData.countDocuments({});

    // Count documents in Customer collection where role is 'user'
    const customerCount = await Customer.countDocuments({ role: 'user' });

    // Send response with both counts
    res.status(200).json({
      success: true,
      data: {
        leadsDataCount,
        customerCount
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


const getLeadCount = async (req, res) => {
    try {
      // Step 1: Fetch status types from the status schema
      const statusTypes = await Status.find({}, 'status_type'); // Adjust field name if needed
  
      // Extract status types into an array
      const statusTypeArray = statusTypes.map(status => status.status_type);
  
      // Step 2: Count leads by status
      const leadStatusCounts = await LeadsData.aggregate([
        {
          $match: {
            status: { $in: statusTypeArray } // Match only leads with status in the fetched types
          }
        },
        {
          $group: {
            _id: "$status", // Group by the 'status' field
            count: { $sum: 1 } // Count the number of documents for each status
          }
        }
      ]);
  
      // Step 3: Count customers by status
      const customerStatusCounts = await Customer.aggregate([
        {
          $match: {
            status: { $in: statusTypeArray } // Match only customers with status in the fetched types
          }
        },
        {
          $group: {
            _id: "$status", // Group by the 'status' field
            count: { $sum: 1 } // Count the number of documents for each status
          }
        }
      ]);
  
      // Format the lead result to match the desired output
      const leadResult = statusTypeArray.reduce((acc, status) => {
        acc[status] = 0; // Initialize counts for each status type
        return acc;
      }, {});
  
      leadStatusCounts.forEach(statusCount => {
        if (statusCount._id in leadResult) {
          leadResult[statusCount._id] = statusCount.count;
        }
      });
  
      // Format the customer result to match the desired output
      const customerResult = statusTypeArray.reduce((acc, status) => {
        acc[status] = 0; // Initialize counts for each status type
        return acc;
      }, {});
  
      customerStatusCounts.forEach(statusCount => {
        if (statusCount._id in customerResult) {
          customerResult[statusCount._id] = statusCount.count;
        }
      });
  
      // Send response with both counts
      res.status(200).json({
        success: true,
        data: {
          leads: leadResult,
          customers: customerResult
        }
      });
    } catch (error) {
      console.error('Error counting leads and customers by status:', error);
      res.status(500).json({
        success: false,
        message: 'Error counting leads and customers by status'
      });
    }
  };
  
  
  
module.exports = {
  getCounts , getLeadCount
};
