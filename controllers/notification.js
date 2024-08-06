const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification")
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
  

  module.exports = {getNotification}