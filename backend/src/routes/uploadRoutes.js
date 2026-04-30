const express = require('express');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Upload multiple images and one video
// @route   POST /api/upload/bulk
// @access  Private
router.post('/bulk', protect, upload.fields([
  { name: 'images', maxCount: 5 },
  { name: 'video', maxCount: 1 }
]), (req, res) => {
  try {
    const images = req.files['images'] ? req.files['images'].map(f => f.path) : [];
    const video = req.files['video'] ? req.files['video'][0].path : null;

    res.status(200).json({
      success: true,
      images,
      videoUrl: video
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// @desc    Upload single image to Cloudinary (Legacy support)
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'Please upload a file' });
  }

  res.status(200).json({
    success: true,
    url: req.file.path,
    public_id: req.file.filename
  });
});

module.exports = router;
