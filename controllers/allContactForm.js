const asyncHandler = require('express-async-handler');
const Message = require("../models/contact_lead")// Adjust path as necessary
const { sendNotification } = require('./sendNotification');// Adjust path as necessary
const User = require('../models/user'); // Adjust path as necessary
const Notification = require("../models/notification")
const createMessage = asyncHandler(async (req, res) => {
    try {
      const { 
        firstname = "", 
        lastname = "", 
        email = "", 
        mobile = "", 
        status = "New", 
        byLead = "user", 
        leadType = "", 
        companyname = "", 
        leadInfo = "", 
        leadsDetails = "", 
        isExcept = null, 
        name = "", 
        subject = "", 
        phone = "", 
        message = "", 
        API_KEY 
      } = req.body;
  
      if (!API_KEY) {
        return res.status(400).json({ msg: "API_KEY is required." });
      }
  
      // Find the user with the matching API_KEY
      const user = await User.findOne({ API_KEY });
  
      if (!user) {
        return res.status(404).json({ msg: "No user found with the provided API_KEY." });
      }
  
      // Save message data with a reference to the user and other fields
      const newMessage = new Notification({
        firstname,
        lastname,
        email,
        mobile,
        status,
        byLead:'user',
        leadType,
        companyname,
        leadInfo,   
        leadsDetails,
        isExcept,
        name,
        subject,
        phone,
        message,
        API_KEY, // Store API_KEY in the message
        user: user._id, // Associate the message with the user's ID
      });
  
      const savedMessage = await newMessage.save();
  
      let notificationResponse = null; // Variable to store the notification response
  
      // Send notifications to the user's device tokens
      const deviceTokens = user.deviceTokens;
  
      if (deviceTokens && deviceTokens.length > 0) {
        const notificationData = {
          title: "Leads From Website",
          body: `A new message from ${name} has been received from the Website.`,
          token: deviceTokens[0], // Sending to the first device token for simplicity
        };
  
        try {
          notificationResponse = await sendNotification(notificationData);
          console.log('Notification Response:', notificationResponse);
        } catch (notificationError) {
          console.error('Error in sending notification:', notificationError);
        }
      } else {
        console.log("No device tokens found for user with API_KEY:", API_KEY);
      }
  
      // Respond with the saved message and notification data
      res.status(200).json({ savedMessage, notificationResponse });
  
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  
  

module.exports = {createMessage};
