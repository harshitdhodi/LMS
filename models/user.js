const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // _id :mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  companyname: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  API_KEY: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    default: "user",
  },
  status: {
    type: String,
    default: "New",
  },
  byLead: {
    type: String,
    default: "admin",
  },
  photo: [
    {
      type: String,
    },
  ],
  resetOTP: {
    type: String,
  },
  deviceTokens: {
    type: [String], // Array of strings to store multiple device tokens
    default: [], // Default to an empty array
  },
});

// Model
const User = mongoose.model("user", userSchema);
module.exports = User;
