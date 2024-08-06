const User = require('../models/user'); // Adjust the path as necessary

/**
 * Retrieves device tokens for a specific user.
 * @param {String} userId - The ID of the user.
 * @returns {Promise<Array<String>>} - A promise that resolves to an array of device tokens.
 */
const getDeviceTokensForUser = async (userId) => {
    try {
      const user = await User.findById(userId).select('API_KEY');
      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        return null;
      }
      return user.API_KEY || null; // Ensure `API_KEY` is returned correctly
    } catch (error) {
      console.error(`Error retrieving API key for user ${userId}:`, error);
      return null;
    }
  };
  
   

module.exports = getDeviceTokensForUser;
