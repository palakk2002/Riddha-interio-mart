const mongoose = require('mongoose');

const EmailQueueSchema = new mongoose.Schema({
  to: {
    type: String,
    required: true,
    index: true
  },
  subject: {
    type: String,
    required: true
  },
  templateName: {
    type: String,
    required: true
  },
  templateData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'sent', 'failed'],
    default: 'pending',
    index: true
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 3
  },
  lastError: {
    type: String,
    default: ''
  },
  nextAttemptAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

EmailQueueSchema.index({ status: 1, nextAttemptAt: 1 });

// TTL index to automatically purge sent/failed email elements after 30 days
EmailQueueSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('EmailQueue', EmailQueueSchema);
