const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  review: {
    type: String,
    required: [true, 'Please add a review text']
  },
  images: [String],
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  helpfulVotes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }],
  helpfulCount: {
    type: Number,
    default: 0
  },
  reports: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  reportCount: {
    type: Number,
    default: 0
  },
  isFlagged: {
    type: Boolean,
    default: false
  },
  sellerResponse: {
    text: String,
    respondedAt: Date
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
ReviewSchema.index({ product: 1, createdAt: -1 });

// Static method to get average rating and save
ReviewSchema.statics.getAverageRating = async function(productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId, isApproved: true }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      averageRating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0,
      totalReviews: obj[0] ? obj[0].totalReviews : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
ReviewSchema.post('save', async function() {
  await this.constructor.getAverageRating(this.product);
});

// Call getAverageRating before remove
ReviewSchema.post('remove', async function() {
  await this.constructor.getAverageRating(this.product);
});

// Also handle findOneAndDelete etc if needed
ReviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    await doc.constructor.getAverageRating(doc.product);
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
