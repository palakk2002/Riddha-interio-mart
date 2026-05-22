const mongoose = require('mongoose');

const InventoryReservationSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['reserved', 'completed', 'released'],
    default: 'reserved',
    index: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryReservation', InventoryReservationSchema);
