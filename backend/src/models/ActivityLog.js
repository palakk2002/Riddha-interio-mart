const mongoose = require('mongoose');

const ActivityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  target: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Admin', 'Manager', 'Seller', 'System'],
    default: 'System'
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
