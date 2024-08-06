const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path according to your file structure

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from request headers
    const token = req.headers.authorization?.split(' ')[1];
console.log(token)
    if (!token) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Replace with your JWT secret
console.log(decoded)
    // Attach user information to request object
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: 'User not found' });
    }

    req.user = {
      id: user._id,
      username: user.username,
      role: decoded.role, // Ensure role is included in the token
    };

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ msg: 'Invalid token' });
  }
};

module.exports = {authMiddleware};
