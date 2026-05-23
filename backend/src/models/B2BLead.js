const mongoose = require('mongoose');

const B2BLeadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  companyName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  profession: { type: String, enum: ['Builder', 'Contractor', 'Designer', 'Interior Designer', 'Other'], required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Verified', 'Rejected'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('B2BLead', B2BLeadSchema);
