const mongoose = require('mongoose');

const ReferralSettingsSchema = new mongoose.Schema({
  isEnabled: {
    type: Boolean,
    default: true
  },
  referrerReward: {
    type: Number,
    default: 100
  },
  newUserReward: {
    type: Number,
    default: 50
  }
}, { timestamps: true });

module.exports = mongoose.model('ReferralSettings', ReferralSettingsSchema);
