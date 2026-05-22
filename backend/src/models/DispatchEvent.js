const mongoose = require('mongoose');

const DispatchEventSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order',
    required: true
  },
  deliveryBoy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Delivery',
    required: true
  },
  broadcastStatus: {
    type: String,
    enum: ['Offered', 'Accepted', 'Rejected', 'Expired'],
    default: 'Offered'
  },
  offeredAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true // offeredAt + 60 seconds
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

DispatchEventSchema.index({ deliveryBoy: 1, broadcastStatus: 1 });
DispatchEventSchema.index({ order: 1, broadcastStatus: 1 });

module.exports = mongoose.model('DispatchEvent', DispatchEventSchema);
