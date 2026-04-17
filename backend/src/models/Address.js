const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  fullName: {
    type: String,
    required: [true, 'Please add a full name']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Please add a mobile number'],
    match: [/^[0-9]{10}$/, 'Please add a valid 10-digit mobile number']
  },
  pincode: {
    type: String,
    required: [true, 'Please add a pincode'],
    match: [/^[0-9]{6}$/, 'Please add a valid 6-digit pincode']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  fullAddress: {
    type: String,
    required: [true, 'Please add a full address']
  },
  landmark: {
    type: String
  },
  addressType: {
    type: String,
    enum: ['Home', 'Work', 'Other'],
    default: 'Home'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Address', AddressSchema);
