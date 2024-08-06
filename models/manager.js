const mongoose = require("mongoose");
const User = require("../models/user")
const Schema = mongoose.Schema;
const managerSchema = new mongoose.Schema({
  // _id :mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,
    trim: true,
  },
  companyname:{
    type: String,
    require: true,
  },
  mobile:{
    type: String,
    require: true,
  },
  
  password: {
    type: String,
   require:"true",
    trim: true,
  },
  role: {
    type: String,
    default:"user"
},
status: {
  type: String,
  default:"new"
},
byLead: {
  type: String,
  default:"admin"
},
user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
photo: [{
    type: String,
  
 }],
resetOTP: {
    type: String,
  },
 
});

//model

const Manager = mongoose.model("manager", managerSchema);
module.exports = Manager;
