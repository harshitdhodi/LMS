const Manager = require("../models/manager")
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
//create user 
const createManager = asyncHandler(async (req, res) => {
    try {
      // Extract the user ID from the query parameters
      const { id } = req.query;
  
      // Extract the password from the request body
      const { password, ...otherData } = req.body;
  
      // Hash the password with bcrypt
      const saltRounds = 10; // You can adjust the number of salt rounds
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create and save the new manager with hashed password
      const newManager = new Manager({
        ...otherData, // Spread operator to include all properties from req.body except password
        password: hashedPassword, // Replace the plain password with hashed password
        user: id // Add the user ID to the manager document
      });
  
      const savedManager = await newManager.save();
      res.status(201).json(savedManager);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  
  //get user by userId
  const getManagerByUserId = asyncHandler(async (req, res) => {
    try {
      const {userId} = req.query;
  
      // Find the manager associated with this user
      const manager = await Manager.find({ user: userId });
  
      if (!manager) {
        return res.status(404).json({ msg: "Manager not found for this user" });
      }
  
      // Respond with the manager data
      res.json(manager);
    } catch (error) {
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });

  const deletemanager = asyncHandler(async (req, res) => {
    try {
        const {id} = req.query;
        const manager = await Manager.findByIdAndDelete(id);
        if (!manager) {
            return res.status(400).json({ msg: "manager not found" });
        }
        res.status(200).json({ msg: "manager deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  

  //update manager 
  const updateManager = asyncHandler(async (req, res) => {
    try {
      // Extract the user ID from the query parameters
      const { id } = req.query;
  
      // Find the manager by ID
      const manager = await Manager.findById(id);
  
      if (!manager) {
        return res.status(404).json({ msg: "Manager not found" });
      }
  
      // Extract the password and other data from the request body
      const { password, ...otherData } = req.body;
  
      // If a password is provided, hash it
      if (password) {
        const saltRounds = 10; // You can adjust the number of salt rounds
        otherData.password = await bcrypt.hash(password, saltRounds);
      }
  
      // Update the manager's information with the new data
      Object.assign(manager, otherData);
  
      // Save the updated manager
      const updatedManager = await manager.save();
  
      res.status(200).json(updatedManager);
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Server error", error: error.message });
    }
  });
  

//get manager by Id 
const getManagerById = asyncHandler(async (req, res) => {
  try {
    const {id} = req.query;

    // Find the manager associated with this user
    const manager = await Manager.findById(id);

    if (!manager) {
      return res.status(404).json({ msg: "Manager not found for this user" });
    }

    // Respond with the manager data
    res.json(manager);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});


module.exports = {createManager ,deletemanager,updateManager,getManagerById, getManagerByUserId}