// services/notificationService.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (assumes setup in firebaseConfig.js)
const { initializeFirebase } = require('../config/firebaseConfig');
initializeFirebase();

const sendNotification = async (notificationData) => {
  try {
    // Send notification using Firebase Admin SDK
    const response = await admin.messaging().sendMulticast({
      tokens: notificationData.tokens,
      notification: {
        title: notificationData.title,
        body: notificationData.body,
      },
    });
    
    return response; // Return the response from Firebase
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error; // Rethrow the error to be handled by the calling function
  }
};

module.exports = { sendNotification };
