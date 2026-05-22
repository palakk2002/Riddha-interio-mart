const mongoose = require('mongoose');

const CampaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a campaign title'],
    trim: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'Seller',
    required: true
  },
  type: {
    type: String,
    enum: ['Flash Sale', 'Product Boost'],
    required: [true, 'Please specify campaign type (Flash Sale or Product Boost)']
  },
  discountPercentage: {
    type: Number,
    required: [true, 'Please specify the discount percentage']
  },
  products: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  budget: {
    type: Number,
    required: [true, 'Please specify campaign budget']
  },
  reachCount: {
    type: Number,
    default: 0
  },
  conversions: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date,
    required: [true, 'Please specify start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please specify end date']
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Active', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true
});

CampaignSchema.index({ seller: 1 });
CampaignSchema.index({ status: 1 });

module.exports = mongoose.model('Campaign', CampaignSchema);
