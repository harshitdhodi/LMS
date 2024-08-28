const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification")
const Leads = require("../models/lead")
const getNotification = asyncHandler(async (req, res) => {
    try {
      const { id } = req.user;
  
      if (!id) {
        return res.status(400).json({ msg: "User ID is required." });
      }
  
      // Fetch notifications for the given user ID
      const notifications = await Notification.find({ user: id });
  
      if (!notifications.length) {
        return res.status(404).json({ msg: "No notifications found for this user." });
      }
  
      // Update the status field for these notifications
      const updateResult = await Notification.updateMany(
        { user: id },
        { $set: { status: 'old' } } // Update only the status field
      );
  
      // Check if the update was successful
      if (updateResult.modifiedCount === 0) {
        console.log('No documents were updated.');
      }
  
      // Return the updated notifications
      const updatedNotifications = await Notification.find({ user: id });
  
      res.status(200).json(updatedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  
  const updateIsExcept = async (req, res) => {
    try {
      const { id } = req.query; // User ID from query parameter
  
      if (!id) {
        return res.status(400).json({ msg: "User ID is required." });
      }
  
      // Find the notification by ID
      const notification = await Notification.findById(id);
  
      if (!notification) {
        return res.status(404).json({ msg: "Notification not found." });
      }
  
      // Update isExcept status
      notification.isExcept = true; // Set to true if that is your requirement
      await notification.save();
  
      // If isExcept is true, save data to Leads schema
      if (notification.isExcept) {
        // Create a new Lead with the fields from the notification
        const newLead = new Leads({
          firstname: notification.firstname || "", // Default to an empty string if not present
          lastname: notification.lastname || "", // Default to an empty string if not present
          email: notification.email || "", // Default to an empty string if not present
          mobile: notification.mobile || "", // Default to an empty string if not present
          companyname: notification.companyname || "", // Default to an empty string if not present
          user: notification.user,
          leadInfo: notification.leadInfo || "", // Default to an empty string if not present
          leadsDetails: notification.leadsDetails || "", // Default to an empty string if not present
          byLead: notification.byLead || "admin", // Default to 'admin' if not present
          leadType: notification.leadType || "", // Default to an empty string if not present
          status: notification.status || "New", // Default to "New" if not provided
          name: notification.name || "", // Default to an empty string if not present
          subject: notification.subject || "", // Default to an empty string if not present
          phone: notification.phone || "", // Default to an empty string if not present
          message: notification.message || "", // Default to an empty string if not present
          API_KEY: notification.API_KEY || "", // Default to an empty string if not present
        });
  
        await newLead.save();
      }
  
      res.status(200).json({ msg: "Status updated and data moved to Leads schema." });
  
    } catch (error) {
      console.error("Error updating isExcept status:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  
  

  module.exports = {getNotification , updateIsExcept}
