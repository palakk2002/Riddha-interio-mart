const express = require('express');
const {
  createCoupon,
  getSellerCoupons,
  deleteCoupon,
  createCampaign,
  getSellerCampaigns,
  getMarketingAnalytics
} = require('../controllers/marketingController');

const { protect, authorize } = require('../middleware/auth');
const { check, param } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Apply auth middleware to protect all marketing routes
router.use(protect);
router.use(authorize('seller', 'admin'));

router.route('/coupons')
  .post([
    check('code', 'Coupon code is required').not().isEmpty(),
    check('discountType', 'Discount type must be flat or percentage').isIn(['flat', 'percentage']),
    check('discountValue', 'Discount value is required').isNumeric(),
    check('expiryDate', 'Expiry date is required').isISO8601(),
    validate
  ], createCoupon)
  .get(getSellerCoupons);

router.route('/coupons/:id')
  .delete([
    param('id', 'Invalid coupon ID format').isMongoId(),
    validate
  ], deleteCoupon);

router.route('/campaigns')
  .post([
    check('title', 'Campaign title is required').not().isEmpty(),
    check('type', 'Campaign type must be Flash Sale or Product Boost').isIn(['Flash Sale', 'Product Boost']),
    check('discountPercentage', 'Discount percentage is required').isNumeric(),
    check('budget', 'Campaign budget is required').isNumeric(),
    check('startDate', 'Start date is required').isISO8601(),
    check('endDate', 'End date is required').isISO8601(),
    validate
  ], createCampaign)
  .get(getSellerCampaigns);

router.route('/analytics')
  .get(getMarketingAnalytics);

module.exports = router;
