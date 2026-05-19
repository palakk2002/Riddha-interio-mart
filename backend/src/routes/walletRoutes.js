const express = require('express');
const router = express.Router();
const {
  getSellerWallet,
  getDeliveryWallet,
  requestSellerWithdrawal,
  approvePayout,
  depositCodLiability,
  getAdminFinancialAnalytics
} = require('../controllers/walletController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all wallet routes
router.use(protect);

// Seller endpoints
router.get('/seller/me', authorize('seller'), getSellerWallet);
router.post('/seller/payout', authorize('seller'), requestSellerWithdrawal);

// Delivery Partner endpoints
router.get('/delivery/me', authorize('delivery'), getDeliveryWallet);

// Admin oversight and settlements
router.post('/admin/payouts/:id/approve', authorize('admin'), approvePayout);
router.post('/admin/delivery/cod-deposit', authorize('admin'), depositCodLiability);
router.get('/admin/analytics', authorize('admin'), getAdminFinancialAnalytics);

module.exports = router;
