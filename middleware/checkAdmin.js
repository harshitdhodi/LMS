// middleware/checkAdmin.js
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path according to your project structure

const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ msg: "No token provided, authorization denied" });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ msg: "Access denied, not an admin" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {checkAdmin};
