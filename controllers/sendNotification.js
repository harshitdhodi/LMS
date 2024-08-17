// services/notificationService.js
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK (assumes setup in firebaseConfig.js)
const { initializeFirebase } = require('../config/firebaseConfig');
initializeFirebase();

const sendNotification = async (notificationData) => {
  try {
    if (!notificationData.token) {
      throw new Error('Notification token is required');
    }

    const response = await admin.messaging().send({
      token: notificationData.token,  // Single device token
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
