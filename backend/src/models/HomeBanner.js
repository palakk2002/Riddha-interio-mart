const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  src: {
    type: String,
    required: [true, 'Please add a background image URL or upload data']
  },
  alt: {
    type: String,
    trim: true,
    default: 'Homepage hero banner image'
  },
  caption: {
    type: String,
    trim: true,
    default: ''
  }
});

const HomeBannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a banner title'],
    trim: true,
    maxlength: [120, 'Banner title can not be more than 120 characters']
  },
  subtitle: {
    type: String,
    trim: true,
    maxlength: [500, 'Subtitle can not be more than 500 characters']
  },
  bgImage: {
    type: ImageSchema,
    required: true
  },
  primaryBtnText: {
    type: String,
    trim: true,
    default: 'Shop Collection'
  },
  primaryBtnLink: {
    type: String,
    trim: true,
    default: '/shop'
  },
  secondaryBtnText: {
    type: String,
    trim: true,
    default: 'View Gallery'
  },
  secondaryBtnLink: {
    type: String,
    trim: true,
    default: '/gallery'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomeBanner', HomeBannerSchema);
