const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const DeliverySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  avatar: {
    type: String,
    default: ""
  },
  vehicleType: {
    type: String,
    enum: ['Bike', 'Van', 'Truck'],
    default: 'Bike'
  },
  vehicleNumber: {
    type: String
  },
  role: {
    type: String,
    default: 'delivery'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  status: {
    type: String,
    enum: ['Available', 'Busy', 'Offline'],
    default: 'Offline'
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

DeliverySchema.pre('save', async function(next) {
  if (!this.isModified('password')) next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

DeliverySchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'delivery' }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

DeliverySchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Delivery', DeliverySchema);
