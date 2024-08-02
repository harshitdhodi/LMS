const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var LeadQuality = new mongoose.Schema({
    lead_type:{
        type:String,
        required:true,
       unique :true
    },
    
});

//Export the model
module.exports = mongoose.model('leadQuality', LeadQuality);