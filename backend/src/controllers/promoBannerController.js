const mongoose = require('mongoose');
const PromoBanner = require('../models/PromoBanner');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildPromoBannerPayload = (body = {}) => ({
  title: body.title,
  subtitle: body.subtitle,
  image: body.image,
  ctaText: body.ctaText,
  ctaLink: body.ctaLink
});

const getErrorStatus = (error) => {
  if (error?.name === 'ValidationError') return 400;
  return 500;
};

// @desc    Get all promo banners
// @route   GET /api/promo-banner
// @access  Public
exports.getPromoBanners = async (req, res) => {
  try {
    const banners = await PromoBanner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners
    });
  } catch (error) {
    console.error('Get promo banners error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single promo banner
// @route   GET /api/promo-banner/:id
// @access  Public
exports.getPromoBannerById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid promo banner ID' });
    }

    const banner = await PromoBanner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Promo banner not found' });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Get promo banner by id error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create promo banner
// @route   POST /api/promo-banner
// @access  Private/Admin
exports.createPromoBanner = async (req, res) => {
  try {
    const banner = await PromoBanner.create(buildPromoBannerPayload(req.body));

    res.status(201).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Create promo banner error:', error);
    res.status(getErrorStatus(error)).json({ success: false, error: error.message });
  }
};

// @desc    Update promo banner
// @route   PUT /api/promo-banner/:id
// @access  Private/Admin
exports.updatePromoBanner = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid promo banner ID' });
    }

    const banner = await PromoBanner.findByIdAndUpdate(req.params.id, buildPromoBannerPayload(req.body), {
      new: true,
      runValidators: true
    });

    if (!banner) {
      return res.status(404).json({ success: false, error: 'Promo banner not found' });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Update promo banner error:', error);
    res.status(getErrorStatus(error)).json({ success: false, error: error.message });
  }
};

// @desc    Delete promo banner
// @route   DELETE /api/promo-banner/:id
// @access  Private/Admin
exports.deletePromoBanner = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, error: 'Invalid promo banner ID' });
    }

    const banner = await PromoBanner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, error: 'Promo banner not found' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Delete promo banner error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
