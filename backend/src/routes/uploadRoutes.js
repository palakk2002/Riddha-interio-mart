const express = require('express');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Upload image to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload a file' });
  }

  res.status(200).json({
    success: true,
    url: req.file.path, // Cloudinary URL
    public_id: req.file.filename
  });
});

module.exports = router;
