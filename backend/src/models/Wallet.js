const mongoose = require('mongoose');

const WalletTransactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['signup_bonus', 'referral_bonus', 'purchase_debit', 'refund_credit', 'manual_adjustment'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'expired', 'cancelled'],
    default: 'active'
  },
  expiresAt: {
    type: Date
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const WalletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [WalletTransactionSchema]
}, { timestamps: true });

// Ensure fast queries for balance checks
WalletSchema.index({ user: 1 });

module.exports = mongoose.model('Wallet', WalletSchema);
