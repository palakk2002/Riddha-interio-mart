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

// Compound index for high-speed audits and logs searching
ActivityLogSchema.index({ user: 1, createdAt: -1 });

// TTL index to automatically purge stale activity logs after 90 days
ActivityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

module.exports = mongoose.model('ActivityLog', ActivityLogSchema);
