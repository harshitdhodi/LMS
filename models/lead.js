const mongoose = require('mongoose'); // Erase if already required
const Schema = mongoose.Schema;
const User = require("../models/user")
// Declare the Schema of the Mongo model
var leadSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true, 
    },
    lastname:{
        type:String,
        required:true, 
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
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
        required:true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
    leadInfo:{
        type:String,
        required:true,
    },
    leadsDetails :{
        type:String,
        required:true,
    }
});

//Export the model
module.exports = mongoose.model('Leads', leadSchema);