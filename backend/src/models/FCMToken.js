const mongoose = require('mongoose');

const FCMTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel'
  },
  userModel: {
    type: String,
    required: true,
    enum: ['User', 'Seller', 'Delivery', 'Admin']
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  platform: {
    type: String,
    enum: ['web', 'mobile'],
    default: 'web'
  },
  lastUsedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Compound indexes for high-speed queries
FCMTokenSchema.index({ user: 1, userModel: 1 });

// TTL index to automatically purge device tokens that have been inactive for 60 days
FCMTokenSchema.index({ lastUsedAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

module.exports = mongoose.model('FCMToken', FCMTokenSchema);
