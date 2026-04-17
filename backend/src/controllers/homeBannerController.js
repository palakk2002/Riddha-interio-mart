const HomeBanner = require('../models/HomeBanner');

// @desc    Get home banner
// @route   GET /api/home-banner
// @access  Public
exports.getHomeBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.findOne().sort('-createdAt');
    if (!banner) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No home banner configured yet.'
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Get home banner error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create home banner
// @route   POST /api/home-banner
// @access  Private/Admin
exports.createHomeBanner = async (req, res) => {
  try {
    const banner = await HomeBanner.create(req.body);
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
    const banner = await HomeBanner.findByIdAndUpdate(req.params.id, req.body, {
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
