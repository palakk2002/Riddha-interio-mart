const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, 'Please add a coupon code'],
    unique: true,
    uppercase: true,
    trim: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'Seller',
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    required: [true, 'Please specify discount type (percentage or flat)']
  },
  discountValue: {
    type: Number,
    required: [true, 'Please specify a discount value']
  },
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  maxDiscountAmount: {
    type: Number
  },
  usageLimit: {
    type: Number,
    default: 100
  },
  usedCount: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date,
    required: [true, 'Please add an expiry date']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Dynamic indexes for fast checkout validations
CouponSchema.index({ code: 1, isActive: 1, expiryDate: 1 });
CouponSchema.index({ seller: 1 });

module.exports = mongoose.model('Coupon', CouponSchema);
