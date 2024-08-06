// config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('../route/lead-management-system-245fb-firebase-adminsdk-vn38p-0f8837638f.json');


const initializeFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://lead-management-system-245fb-default-rtdb.firebaseio.com"
    });
  }
};

module.exports = { initializeFirebase };
