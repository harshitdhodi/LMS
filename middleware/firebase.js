const initializeFirebase = require('../config/firebaseConfig'); // Adjust path as needed

/**
 * Verifies and validates a device token using Firebase initializeFirebase SDK.
 * @param {string} token - The device token to be verified.
 * @returns {object|null} - Decoded token data if valid, otherwise null.
 */
const verifyAndValidateDeviceToken = async (token) => {
    console.log("token", token)
  try {
    const decodedToken = await initializeFirebase.auth().verifyIdToken(token);
    return decodedToken; // Return decoded token data if valid
  } catch (error) {
    console.error('Error verifying token:', error);
    return null; // Return null if token is invalid
  }
};

/**
 * Middleware to extract and verify device token from the Authorization header.
 */
const extractDeviceToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ msg: 'Authorization header is missing' });
    }
  
    // Assuming the Authorization header format is 'Bearer <token>'
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ msg: 'Invalid Authorization header format' });
    }

    const deviceToken = tokenParts[1];
    const decodedToken = await verifyAndValidateDeviceToken(deviceToken);

    if (!decodedToken) {
      return res.status(401).json({ msg: 'Invalid device token' });
    }

    req.user = decodedToken; // Store user information from token if needed
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error extracting and validating device token:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// module.exports = { extractAndValidateDeviceToken };


  module.exports = {extractDeviceToken};