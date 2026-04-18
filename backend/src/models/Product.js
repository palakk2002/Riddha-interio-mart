const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  sku: {
    type: String
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  discountPrice: {
    type: Number
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  subcategory: {
    type: String
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  material: {
    type: String
  },
  dimensions: {
    type: String
  },
  thickness: {
    type: String
  },
  color: {
    type: String
  },
  unit: {
    type: String,
    default: 'piece'
  },
  images: [String],
  countInStock: {
    type: Number,
    required: true,
    default: 0
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    required: true,
    refPath: 'sellerType'
  },
  sellerType: {
    type: String,
    required: true,
    enum: ['Seller', 'Admin'],
    default: 'Seller'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);
