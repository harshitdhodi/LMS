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
      const { id } = req.query; // Notification ID from query parameter
  
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
        const newLead = new Leads({
          firstname: notification.firstname,
          lastname: notification.lastname,
          email: notification.email,
          mobile: notification.mobile,
          companyname: notification.companyname,
          user: notification.user,
          leadInfo: notification.leadInfo,
          leadsDetails: notification.leadsDetails,
          byLead: notification.byLead,
          leadType: notification.leadType,
        });
  
        await newLead.save();
  
        // Optionally, delete the notification entry if it's no longer needed
        // await Notification.findByIdAndDelete(id);
      }
  
      res.status(200).json({ msg: "Status updated and data moved to Leads schema." });
  
    } catch (error) {
      console.error("Error updating isExcept status:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  

  module.exports = {getNotification , updateIsExcept}
