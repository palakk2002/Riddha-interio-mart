const express = require('express');
const {
  getFavouriteSections,
  getFavouriteSectionById,
  createFavouriteSection,
  updateFavouriteSection,
  deleteFavouriteSection
} = require('../controllers/favouriteSectionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getFavouriteSections).post(protect, authorize('admin'), createFavouriteSection);
router
  .route('/:id')
  .get(getFavouriteSectionById)
  .put(protect, authorize('admin'), updateFavouriteSection)
  .delete(protect, authorize('admin'), deleteFavouriteSection);

module.exports = router;
