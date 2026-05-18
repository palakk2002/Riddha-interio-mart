const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SellerSchema = new mongoose.Schema({
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
  shopName: {
    type: String,
    required: [true, 'Please add a shop name']
  },
  shopAddress: {
    type: String
  },
  phone: {
    type: String
  },
  gstNumber: {
    type: String,
    default: ""
  },
  panNumber: {
    type: String,
    default: ""
  },
  hsnNumber: {
    type: String,
    trim: true
  },
  gstDoc: {
    type: String
  },
  panDoc: {
    type: String
  },
  shopDoc: {
    type: String
  },
  status: {
    type: String,
    default: ""
  },
  avatar: {
    type: String,
    default: ""
  },
  role: {
    type: String,
    default: 'seller'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

SellerSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

SellerSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id, role: 'seller' }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

SellerSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

SellerSchema.index({ email: 1 });
SellerSchema.index({ isVerified: 1, createdAt: -1 });

module.exports = mongoose.model('Seller', SellerSchema);
