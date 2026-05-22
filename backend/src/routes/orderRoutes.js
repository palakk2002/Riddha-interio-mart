const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  assignOrderToDeliveryBoy,
  respondToDeliveryAssignment,
  checkCodEligibility,
  calculateOrderPricing,
  verifyPayment,
  verifyDeliveryOtp,
  resendDeliveryOtp
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// Public routes
router.route('/calculate-pricing').post(calculateOrderPricing);

router.use(protect);

router.route('/cod-eligibility').post(checkCodEligibility);
router.route('/verify-payment').post(verifyPayment);

router.route('/')
  .get(getOrders)
  .post([
    check('orderItems', 'No order items').isArray({ min: 1 }),
    check('shippingAddress', 'Shipping address is required').not().isEmpty(),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('itemsPrice', 'Items price is required').isNumeric(),
    check('totalPrice', 'Total price is required').isNumeric(),
    validate
  ], addOrderItems);

router.route('/my-orders').get(getMyOrders);

router.route('/:id/status')
  .put(authorize('admin', 'seller', 'delivery'), updateOrderStatus);

router.route('/:id/assign-delivery')
  .put(authorize('admin', 'seller'), assignOrderToDeliveryBoy);

router.route('/:id/delivery-response')
  .put(authorize('delivery'), respondToDeliveryAssignment);

router.route('/:id/verify-otp')
  .post(authorize('delivery'), verifyDeliveryOtp);

router.route('/:id/resend-otp')
  .post(authorize('delivery'), resendDeliveryOtp);

router.route('/:id').get(getOrderById);

module.exports = router;
