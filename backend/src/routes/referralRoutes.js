const express = require('express');
const router = express.Router();
const {
  getWallet,
  getReferralAnalytics,
  getReferralLeaderboard,
  getReferralHistory,
  adminAdjustWallet,
  adminGetAllReferrals
} = require('../controllers/referralController');
const { protect, authorize } = require('../middleware/auth');

// Public route: Top referrers leaderboard
router.get('/leaderboard', getReferralLeaderboard);

// Protected routes (User/Customer context)
router.use(protect);
router.get('/wallet', getWallet);
router.get('/analytics', getReferralAnalytics);
router.get('/history', getReferralHistory);

// Admin-only management routes
router.post('/admin/adjust-wallet', authorize('admin'), adminAdjustWallet);
router.get('/admin/logs', authorize('admin'), adminGetAllReferrals);

module.exports = router;
