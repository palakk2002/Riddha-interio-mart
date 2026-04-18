const mongoose = require('mongoose');

const SectionBannerItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a banner title'],
      trim: true,
      maxlength: [120, 'Banner title can not be more than 120 characters']
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Banner subtitle can not be more than 500 characters']
    },
    image: {
      type: String,
      required: [true, 'Please add a banner image']
    },
    ctaText: {
      type: String,
      trim: true,
      default: 'Shop Now',
      maxlength: [80, 'CTA text can not be more than 80 characters']
    },
    ctaLink: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'CTA link can not be more than 300 characters']
    },
    alt: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { _id: true }
);

const SectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a section title'],
      trim: true,
      maxlength: [120, 'Section title can not be more than 120 characters']
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [300, 'Section subtitle can not be more than 300 characters']
    },
    displayType: {
      type: String,
      enum: ['product', 'category', 'banner'],
      required: [true, 'Please choose a display type'],
      default: 'product'
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    categoryIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    bannerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PromoBanner'
      }
    ],
    bannerItems: [SectionBannerItemSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Section', SectionSchema);
