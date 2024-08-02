const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var StatusType = new mongoose.Schema({
    status_type:{
        type:String,
        required:true,
        unique :true
    },
    
});
    
//Export the model
module.exports = mongoose.model('StatusType', StatusType);