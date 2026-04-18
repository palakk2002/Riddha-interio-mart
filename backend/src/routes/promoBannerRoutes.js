const express = require('express');
const {
  getPromoBanners,
  getPromoBannerById,
  createPromoBanner,
  updatePromoBanner,
  deletePromoBanner
} = require('../controllers/promoBannerController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getPromoBanners).post(protect, authorize('admin'), createPromoBanner);
router
  .route('/:id')
  .get(getPromoBannerById)
  .put(protect, authorize('admin'), updatePromoBanner)
  .delete(protect, authorize('admin'), deletePromoBanner);

module.exports = router;
