const mongoose = require('mongoose');

const DeliveryWalletTransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['delivery_fee_credit', 'cod_cash_collected', 'cod_settlement_to_admin', 'payout_debit'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const DeliveryWalletSchema = new mongoose.Schema({
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery',
    required: true,
    unique: true
  },
  earningsBalance: {
    type: Number,
    default: 0
  },
  codCollectionLiability: {
    type: Number,
    default: 0
  },
  transactions: [DeliveryWalletTransactionSchema]
}, { timestamps: true });

DeliveryWalletSchema.index({ deliveryPartner: 1 });

module.exports = mongoose.model('DeliveryWallet', DeliveryWalletSchema);
