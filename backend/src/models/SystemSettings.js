const mongoose = require('mongoose');

const SystemSettingsSchema = new mongoose.Schema({
  deliveryCommissionRate: {
    type: Number,
    default: 50.00
  }
});

module.exports = mongoose.model('SystemSettings', SystemSettingsSchema);
