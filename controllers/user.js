const User = require("../models/user")
const Manager = require("../models/manager")
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const {sendEmail} = require("../utils.js/customer")
const {uploadPhoto} = require("../middleware/imageUpload")
// Function to generate a unique 16-digit alphanumeric API key
const generateUniqueAPIKey = async () => {
  let isUnique = false;
  let apiKey;

  while (!isUnique) {
    apiKey = crypto.randomBytes(8).toString('hex').toUpperCase(); // Generates a 16-character string

    // Check if the API key already exists in the database
    const existingUser = await User.findOne({ API_KEY: apiKey });
    const existingManager = await Manager.findOne({ API_KEY: apiKey });

    if (!existingUser && !existingManager) {
      isUnique = true; // Exit loop if the API key is unique
    }
  }

  return apiKey;
};

const createUser = asyncHandler(async (req, res) => {
  try {
    const {name, email, password, ...restOfData } = req.body;

    // Check if the user already exists
    const findUser = await User.findOne({ email: email });

    if (!findUser) {
      // Hash the password
      const subject = 'Registration Confirmation';
      await sendEmail(email, subject,name, password, email);
      console.log(email)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate a unique API key
      const apiKey = await generateUniqueAPIKey();

      // Create the new user with the hashed password and API key
      const newUser = await User.create({ name ,email, ...restOfData, password: hashedPassword, API_KEY: apiKey });

      // Also create a manager with the same data and user ID reference
      const newManager = await Manager.create({
        ...restOfData,
        name,
        email, 
        password: hashedPassword,
        user: newUser._id, // Assign the newly created user's _id here
        API_KEY: apiKey // Ensure the manager has the same API key
      });

      res.json({
        user: newUser,
        manager: newManager
      });
    } else {
      throw new Error("User Already Exists");
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


  //login user
  const loginUser = asyncHandler(async (req, res) => {
    const { email, password, deviceTokens } = req.body;
    
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    
    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    
    // Generate token with user ID and role
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1d' }
    );
    
    // Update the device token in the user document
    console.log(deviceTokens)
    if (deviceTokens) {
      // Check if the device token already exists
      if (!user.deviceTokens.includes(deviceTokens)) {
        user.deviceTokens.push(deviceTokens);
      }
      await user.save();
    }
  
    // Respond with the token
    res.status(200).json({ msg: "Logged in successfully", token, id: user._id });
  });
  
  

  const getAllUser = asyncHandler(
    async (req, res) => {
      try {
        // Assuming you want to fetch users with the role 'user'
        const role = 'user';
        const allUser = await User.find({ role: role });
        res.status(200).json(allUser);
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error", error: error.message });
      }
    }
  );


  const updateuser = asyncHandler(async (req, res) => {
    const { id } = req.query; // Assuming the user ID is passed as a URL parameter
    const updates = req.body; // The fields to update are passed in the request body
  
    try {
      // Extract user information from req.user (set by authMiddleware)
      const { username, role } = req.user;
  
      // Find the user
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Update only the provided fields
      const updatedFields = {};
      for (const key in updates) {
        if (updates.hasOwnProperty(key) && user[key] !== undefined) {
          user[key] = updates[key];
          updatedFields[key] = updates[key];
        }
      }
  
      // Update the 'updatedBy' field with username and role
      user.updatedBy = {
        username: username,
        role: role
      };
  
      // Set the 'byuser' field based on user role
      user.byuser = role === 'admin' ? 'admin' : 'user';
  
      await user.save();
  
      // Include the 'updatedBy' and 'byuser' fields in the response
      updatedFields.updatedBy = user.updatedBy;
      updatedFields.byuser = user.byuser;
  
      res.status(200).json({
        message: 'User updated successfully',
        data: updatedFields,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error', error: error.message });
    }
  });

  // Update status fields
  const updateUserFields = asyncHandler(async (req, res) => {
    const { id } = req.query; // Extract user ID from query parameters
    const updates = req.body; // Extract fields to update from request body
  
    try {
      // Handle file upload
      uploadPhoto(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ msg: "Error uploading file", error: err.message });
        }
  
        // Extract user role from token (assuming it's in req.user.role)
        const { role } = req.user;
  
        if (role !== 'admin' && role !== 'user') {
          return res.status(403).json({ msg: "Permission denied. Unauthorized role." });
        }
  
        // Fetch user by ID
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }
  
        // Update user fields
        for (const key in updates) {
          if (updates.hasOwnProperty(key) && user[key] !== undefined) {
            user[key] = updates[key];
          }
        }
  
        // If a new photo is uploaded, update the photo field
        if (req.file) {
          user.photo = req.file.filename; // Update the photo field with the filename
        }
  
        await user.save();
  
        // Return only the updated fields
        const updatedFields = {};
        for (const key in updates) {
          if (updates.hasOwnProperty(key)) {
            updatedFields[key] = user[key];
          }
        }
  
        // Include the photo field in the response if updated
        if (req.file) {
          updatedFields.photo = user.photo;
        }
  
        res.status(200).json(updatedFields);
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });

 //get user by userId
 const getUserByUserId = asyncHandler(async (req, res) => {
  try {
    const {id} = req.query;

    // Find the manager associated with this user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Manager not found for this user" });
    }

    // Respond with the manager data
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  try {
      const {id} = req.query;
      const user = await User.findByIdAndDelete(id);
      if (!user) {
          return res.status(400).json({ msg: "User not found" });
      }
      res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server error", error: error.message });
  }
});

const getUserByUser = asyncHandler(async (req, res) => {
  try {
    const {id} = req.user;
console.log(id)
    // Find the manager associated with this user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ msg: "Manager not found for this user" });
    }

    // Respond with the manager data
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


const updateAdmin = asyncHandler(async (req, res) => {
  try {
    const { id } = req.user; // Extract the admin ID from the request user
    let updates = { ...req.body }; // Get the fields to update from the request body

    // If there's a file uploaded, handle it
    if (req.file) {
      updates.photo = req.file.filename; // Store the filename or path
    }

    // Find and update the admin by ID with the fields provided in the request body
    const Admin = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    if (!Admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }

    res.status(200).json(Admin); // Send the updated admin data in the response
  } catch (error) {
    console.error("Error updating admin:", error);
    res.status(500).json({ msg: "Server error", error: error.message }); // Send server error response
  }
});



const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie('token', { 
      httpOnly: true,
      sameSite:"None",
      secure:true 

    });
    return res.status(200).json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
  module.exports = {createUser ,loginUser,logoutUser , getAllUser,deleteUser,updateAdmin, updateuser, getUserByUserId,getUserByUser , updateUserFields};