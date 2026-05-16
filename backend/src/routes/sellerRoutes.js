const express = require('express');
const { registerSeller, loginSeller, getSellerMe, updateSellerProfile, getSellerStockStatus } = require('../controllers/sellerController');
const { getSellerAnalytics } = require('../controllers/sellerAnalyticsController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', [
  check('fullName', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate
], registerSeller);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validate
], loginSeller);
router.get('/me', protect, getSellerMe);
router.put('/profile', protect, updateSellerProfile);
router.get('/stock-status', protect, getSellerStockStatus);
router.get('/analytics', protect, getSellerAnalytics);

module.exports = router;
