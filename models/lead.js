const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;
const User = require("../models/user")
// Declare the Schema of the Mongo model
var leadSchema = new mongoose.Schema({
    firstname:{
        type:String,
         
    },
    lastname:{
        type:String,
         
    },
    email:{
        type:String,
         
    },
    mobile:{
        type:String,
        
    },
    status: {
        type: String,
        default:"New"
      },
    byLead: {
        type: String,
        default:"admin"
    },
    leadType:{
        type:String
    },
    companyname:{   
        type:String,
        
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
    leadInfo:{
        type:String,
        
    },
    leadsDetails :{
        type:String,
        
    },
    name: {
        type: String,
        default: ""
      },
      subject: {
        type: String,
        default: ""
      },
      phone: {
        type: String,
        default: ""
      },
      message: {
        type: String,
        default: ""
      },
      API_KEY: {
        type: String,
    
      },
});

//Export the model
module.exports = mongoose.model('Leads', leadSchema);
