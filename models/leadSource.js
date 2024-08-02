const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var LeadSourceSchema = new mongoose.Schema({
   leadSources:{
        type:String,
        required:true,
        unique :true
    },
    
});
    
//Export the model
module.exports = mongoose.model('LeadSource', LeadSourceSchema);