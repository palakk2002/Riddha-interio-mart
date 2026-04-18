const express = require('express');
const {
  getSections,
  getSectionById,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getSections).post(protect, authorize('admin'), createSection);
router
  .route('/:id')
  .get(getSectionById)
  .put(protect, authorize('admin'), updateSection)
  .delete(protect, authorize('admin'), deleteSection);

module.exports = router;
