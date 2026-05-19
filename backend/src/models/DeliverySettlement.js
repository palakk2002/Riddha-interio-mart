const mongoose = require('mongoose');

const DeliverySettlementSchema = new mongoose.Schema({
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true
  },
  type: {
    type: String,
    enum: ['payout', 'cod_deposit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'rejected'],
    default: 'pending'
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

DeliverySettlementSchema.index({ deliveryPartner: 1 });
DeliverySettlementSchema.index({ type: 1 });

module.exports = mongoose.model('DeliverySettlement', DeliverySettlementSchema);
