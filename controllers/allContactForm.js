const asyncHandler = require('express-async-handler');
const Message = require("../models/contact_lead")// Adjust path as necessary
const { sendNotification } = require('./sendNotification');// Adjust path as necessary
const User = require('../models/user'); // Adjust path as necessary

const createMessage = asyncHandler(async (req, res) => {
    try {
      const { name, email, subject, phone, message, API_KEY } = req.body;
  
      if (!API_KEY) {
        return res.status(400).json({ msg: "API_KEY is required." });
      }
  
      // Save message data
      const newMessage = new Message({
        name,
        email,
        subject,
        phone,
        API_KEY, // Ensure API_KEY is included in the message data
        message
      });
      const savedMessage = await newMessage.save();
  
      let notificationResponse = null; // Variable to store the notification response
  
      // Find users with the matching API_KEY
      const users = await User.find({ API_KEY }).select('deviceTokens');
  
      if (users.length === 0) {
        return res.status(404).json({ msg: "No users found with the provided API_KEY." });
      }
  
      // Iterate over each user to send notifications
      for (const user of users) {
        const deviceTokens = user.deviceTokens;
        console.log('Device Tokens:', deviceTokens);
  
        // Send notification if device tokens are available
        if (deviceTokens && deviceTokens.length > 0) {
          const notificationData = {
            title: "New Message Received",
            body: `A new message from ${name} has been received.`,
            token: deviceTokens[0], // Sending to the first device token for simplicity
          };
          console.log('Notification Data:', notificationData);
  
          try {
            notificationResponse = await sendNotification(notificationData);
            console.log('Notification Response:', notificationResponse);
          } catch (notificationError) {
            console.error('Error in sending notification:', notificationError);
          }
        } else {
          console.log("No device tokens found for user with API_KEY:", API_KEY);
        }
      }
  
      // Respond with the saved message and notification data
      res.status(200).json({ savedMessage, notificationResponse });
  
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  

module.exports = {createMessage};
