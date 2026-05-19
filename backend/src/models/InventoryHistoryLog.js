const mongoose = require('mongoose');

const InventoryHistoryLogSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  action: {
    type: String,
    enum: ['reservation', 'release', 'sale', 'return', 'manual_adjustment'],
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true
  },
  stockBefore: {
    type: Number,
    required: true
  },
  stockAfter: {
    type: Number,
    required: true
  },
  details: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryHistoryLog', InventoryHistoryLogSchema);
