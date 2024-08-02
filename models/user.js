const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // _id :mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    require: true,

  },
  companyname:{
    type: String,
    require: true,
  },
  mobile:{
    type: String,
    require: true,
  },
  API_KEY:{
    type: String,
    require: true,
  },
  password: {
    type: String,
   
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
  photo: [{
    type: String,
  
 }],
  resetOTP: {
    type: String,
  },
 
});

//model

const User = mongoose.model("user", userSchema);
module.exports = User;
