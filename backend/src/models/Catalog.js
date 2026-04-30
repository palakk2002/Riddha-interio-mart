const mongoose = require('mongoose');

const CatalogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'Please add a product code (SKU)'],
    unique: true,
    trim: true
  },
  brand: {
    type: mongoose.Schema.ObjectId,
    ref: 'Brand',
    required: [true, 'Please select a brand']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please add a detailed description']
  },
  images: {
    type: [String],
    required: [true, 'Please add at least one product image']
  },
  material: {
    type: String,
    trim: true
  },
  dimensions: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  targetCustomer: {
    type: String,
    enum: ['individual', 'enterpriser', 'both'],
    default: 'both'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Catalog', CatalogSchema);
