const mongoose = require('mongoose');

const SearchQuerySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    index: true
  },
  count: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Compound unique index for tracking query frequencies per user or overall
SearchQuerySchema.index({ query: 1, user: 1 }, { unique: true });

// Compound index for high-speed recent queries sorting
SearchQuerySchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model('SearchQuery', SearchQuerySchema);
