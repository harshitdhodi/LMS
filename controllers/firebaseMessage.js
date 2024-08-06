// Import and configure Firebase
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyDSJOq-Aw2uRwK1zm9yEu2DrfBIK1-fQ24",
    authDomain: "lead-management-system-245fb.firebaseapp.com",
    projectId: "lead-management-system-245fb",
    storageBucket: "lead-management-system-245fb.appspot.com",
    messagingSenderId: "572192947141",
    appId: "1:572192947141:web:930b4517e29e2ccad2e9ac",
    measurementId: "G-FML788X58Y"
  };

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get the token
getToken(messaging, { vapidKey: 'BBOJSB8NhggLZxRSkhXrpkxCqBZ29p0GuWM6LyLzHALGPv0EcKj4Fmsk6Duk3_aehRBgMkK0redFFiC-cSuIY-M' }).then((currentToken) => {
  if (currentToken) {
    console.log('Token received:', currentToken);
    // Send the token to your server and save it for later use
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});
