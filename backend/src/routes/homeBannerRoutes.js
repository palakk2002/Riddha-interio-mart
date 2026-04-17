const express = require('express');
const {
  getHomeBanner,
  createHomeBanner,
  updateHomeBanner
} = require('../controllers/homeBannerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getHomeBanner).post(protect, authorize('admin'), createHomeBanner);
router.route('/:id').put(protect, authorize('admin'), updateHomeBanner);

module.exports = router;
