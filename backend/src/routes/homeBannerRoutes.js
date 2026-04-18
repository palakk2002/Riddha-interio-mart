const express = require('express');
const {
  getHomeBanners,
  getHomeBannerById,
  createHomeBanner,
  updateHomeBanner,
  deleteHomeBanner
} = require('../controllers/homeBannerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getHomeBanners).post(protect, authorize('admin'), createHomeBanner);
router
  .route('/:id')
  .get(getHomeBannerById)
  .put(protect, authorize('admin'), updateHomeBanner)
  .delete(protect, authorize('admin'), deleteHomeBanner);

module.exports = router;
