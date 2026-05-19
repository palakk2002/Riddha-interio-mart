const mongoose = require('mongoose');

const SellerWalletTransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['sale_credit', 'commission_debit', 'refund_debit', 'payout_debit', 'manual_adjustment'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'cleared', 'cancelled'],
    default: 'pending'
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

const SellerWalletSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true,
    unique: true
  },
  pendingBalance: {
    type: Number,
    default: 0
  },
  withdrawableBalance: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  transactions: [SellerWalletTransactionSchema]
}, { timestamps: true });

SellerWalletSchema.index({ seller: 1 });

module.exports = mongoose.model('SellerWallet', SellerWalletSchema);
