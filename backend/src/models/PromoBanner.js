const mongoose = require('mongoose');

const PromoBannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a promo banner title'],
      trim: true,
      maxlength: [120, 'Promo banner title can not be more than 120 characters']
    },
    subtitle: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Promo subtitle can not be more than 500 characters']
    },
    image: {
      type: String,
      required: [true, 'Please add a promo banner image URL or uploaded image data']
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
      default: '/offers',
      maxlength: [300, 'CTA link can not be more than 300 characters']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PromoBanner', PromoBannerSchema);
