const mongoose = require('mongoose');

const FavouriteSectionItemSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please choose a category']
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ]
  },
  { _id: true }
);

const FavouriteSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: [true, 'Please add a favourite section heading'],
      trim: true,
      maxlength: [120, 'Heading can not be more than 120 characters']
    },
    subheading: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Subheading can not be more than 300 characters']
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    items: {
      type: [FavouriteSectionItemSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('FavouriteSection', FavouriteSectionSchema);
