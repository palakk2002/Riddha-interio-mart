const HomeBanner = require('../models/HomeBanner');
const mongoose = require('mongoose');

const buildBannerPayload = (body = {}) => ({
  title: body.title,
  subtitle: body.subtitle,
  bgImage: {
    src: body.bgImage?.src,
    alt: body.bgImage?.alt,
    caption: body.bgImage?.caption
  },
  primaryBtnText: body.primaryBtnText,
  primaryBtnLink: body.primaryBtnLink,
  secondaryBtnText: body.secondaryBtnText,
  secondaryBtnLink: body.secondaryBtnLink
});

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all home banners
// @route   GET /api/home-banner
// @access  Public
exports.getHomeBanners = async (req, res) => {
  try {
    const banners = await HomeBanner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    console.error('Get home banners error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single home banner
// @route   GET /api/home-banner/:id
// @access  Public
exports.getHomeBannerById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid banner ID' });
    }

    const banner = await HomeBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Home banner not found' });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Get home banner by id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create home banner
// @route   POST /api/home-banner
// @access  Private/Admin
exports.createHomeBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.create(buildBannerPayload(req.body));

    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Create home banner error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update home banner
// @route   PUT /api/home-banner/:id
// @access  Private/Admin
exports.updateHomeBanner = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid banner ID' });
    }

    const banner = await HomeBanner.findByIdAndUpdate(req.params.id, buildBannerPayload(req.body), {
      new: true,
      runValidators: true
    });

    if (!banner) {
      return res.status(404).json({ success: false, error: 'Home banner not found' });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Update home banner error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete home banner
// @route   DELETE /api/home-banner/:id
// @access  Private/Admin
exports.deleteHomeBanner = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid banner ID' });
    }

    const banner = await HomeBanner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Home banner not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete home banner error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
