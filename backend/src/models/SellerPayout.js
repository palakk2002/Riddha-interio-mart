const mongoose = require('mongoose');

const SellerPayoutSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['requested', 'processing', 'completed', 'rejected'],
    default: 'requested'
  },
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  transactionReference: {
    type: String, // UTR number / receipt reference
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

SellerPayoutSchema.index({ seller: 1 });
SellerPayoutSchema.index({ status: 1 });

module.exports = mongoose.model('SellerPayout', SellerPayoutSchema);
