const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'Seller',
    required: true
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject line.'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Orders', 'Payments', 'Catalog', 'Technical', 'Account']
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Low'
  },
  description: {
    type: String,
    required: [true, 'Please add a detailed description of your issue.']
  },
  status: {
    type: String,
    required: true,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  attachments: [{
    type: String // Cloudinary secure URLs for attachments
  }],
  replies: [{
    sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'replies.senderModel'
    },
    senderModel: {
      type: String,
      required: true,
      enum: ['Seller', 'Admin']
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Pre-save hook to automatically generate ticket ID (e.g. RIDDHA-10492)
SupportTicketSchema.pre('validate', function() {
  if (!this.ticketId) {
    const random = Math.floor(10000 + Math.random() * 90000);
    this.ticketId = `RIDDHA-${random}`;
  }
});

// Compound indexes for rapid lookup of active tickets by seller and status
SupportTicketSchema.index({ seller: 1, status: 1 });

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
