const express = require('express');
const {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  moderateReview
} = require('../controllers/reviewController');

const { protect, authorize, tryProtect } = require('../middleware/auth');
const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router({ mergeParams: true }); // Important for nested routes like /products/:productId/reviews

router.route('/')
  .get(getReviews)
  .post(protect, authorize('user', 'admin'), [
    check('rating', 'Rating is required between 1 and 5').isInt({ min: 1, max: 5 }),
    check('review', 'Review text is required').not().isEmpty(),
    validate
  ], createReview);

router.route('/:id')
  .put(protect, authorize('user', 'admin'), [
    check('rating', 'Rating must be between 1 and 5').optional().isInt({ min: 1, max: 5 }),
    validate
  ], updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

router.put('/:id/moderation', protect, authorize('admin'), [
  check('isApproved', 'isApproved boolean is required').isBoolean(),
  validate
], moderateReview);

module.exports = router;
