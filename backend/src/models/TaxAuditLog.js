const mongoose = require('mongoose');

const TaxAuditLogSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['sale', 'refund'],
    default: 'sale'
  },
  shippingState: {
    type: String,
    required: true
  },
  sellerState: {
    type: String,
    required: true
  },
  taxType: {
    type: String,
    enum: ['intra-state', 'inter-state'],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  taxableAmount: {
    type: Number,
    required: true
  },
  cgst: {
    type: Number,
    default: 0
  },
  sgst: {
    type: Number,
    default: 0
  },
  igst: {
    type: Number,
    default: 0
  },
  totalTax: {
    type: Number,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    gstRate: Number,
    taxAmount: Number,
    cgst: Number,
    sgst: Number,
    igst: Number
  }]
}, { timestamps: true });

TaxAuditLogSchema.index({ order: 1 });
TaxAuditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('TaxAuditLog', TaxAuditLogSchema);
