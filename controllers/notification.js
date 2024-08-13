const asyncHandler = require("express-async-handler");
const Notification = require("../models/notification")
const Leads = require("../models/lead")
const getNotification = asyncHandler(async (req, res) => {
  try {
    const { id, role } = req.user; // User ID and role from the request
  
    if (!id) {
      return res.status(400).json({ msg: "User ID is required." });
    }

    if (!role) {
      return res.status(400).json({ msg: "User role is required." });
    }

    let filter = { isExcept: null }; // Default filter to fetch notifications with isExcept as null

    if (role === 'admin') {
      // Admin can see all notifications with isExcept as null
      filter = { isExcept: null };
    } else if (role === 'user') {
      // User must match their token and user ID, show notifications with isExcept as null
      const userToken = req.headers['authorization']; // Assuming token is in the Authorization header

      if (!userToken) {
        return res.status(401).json({ msg: "Unauthorized. No token provided." });
      }

      // Validate the token and user ID here (pseudo-code)
      // const isTokenValid = await validateToken(userToken, id); // Implement your token validation logic
      // if (!isTokenValid) {
      //   return res.status(401).json({ msg: "Unauthorized. Invalid token." });
      // }

      filter = { user: id, isExcept: null };
    } else {
      return res.status(403).json({ msg: "Forbidden. Invalid user role." });
    }

    // Fetch notifications based on the filter
    const notifications = await Notification.find(filter);

    if (!notifications.length) {
      return res.status(404).json({ msg: "No notifications found for this user." });
    }

    // Update the status field for these notifications
    const updateResult = await Notification.updateMany(
      filter,
      { $set: { status: 'old' } } // Update only the status field
    );

    // Check if the update was successful
    if (updateResult.modifiedCount === 0) {
      console.log('No documents were updated.');
    }

    // Return the updated notifications
    const updatedNotifications = await Notification.find(filter);

    res.status(200).json(updatedNotifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

  
  const updateIsExcept = async (req, res) => {
    try {
      const { id, isExcept } = req.query; // Notification ID and isExcept value from query parameters
  
      // Validate isExcept value
      if (isExcept !== 'true' && isExcept !== 'false') {
        return res.status(400).json({ msg: "Invalid isExcept value. It should be 'true' or 'false'." });
      }
  
      // Convert isExcept to boolean
      const isExceptBool = isExcept === 'true';
  
      // Find the notification by ID
      const notification = await Notification.findById(id);
      if (!notification) {
        return res.status(404).json({ msg: "Notification not found." });
      }
  
      // Update isExcept status
      notification.isExcept = isExceptBool;
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
  
      res.status(200).json({ msg: "Status updated and data moved to Leads schema if applicable." });
  
    } catch (error) {
      console.error("Error updating isExcept status:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  };
  
  
  

  module.exports = {getNotification , updateIsExcept}
