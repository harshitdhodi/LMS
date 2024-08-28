const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  firstname: {
    type: String,
    default: ""
  },
  lastname: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  mobile: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "New"
  },
  byLead: {
    type: String,
    default: "admin"
  },
  leadType: {
    type: String,
    default: ""
  },
  companyname: {
    type: String,
    default: ""
  },
  leadInfo: {
    type: String,
    default: ""
  },
  leadsDetails: {
    type: String,
    default: ""
  },
  isExcept: {
    type: Boolean,
    default: null
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  } 
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
