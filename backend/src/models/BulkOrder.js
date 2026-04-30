const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    quantity: { type: Number },
    category: { type: String }
  }],
  message: { type: String },
  status: { type: String, default: 'Pending' }
}, {
  timestamps: true
});

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
