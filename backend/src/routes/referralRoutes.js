const express = require('express');
const router = express.Router();
const {
  getWallet,
  getReferralAnalytics,
  getReferralLeaderboard,
  getReferralHistory,
  adminAdjustWallet,
  adminGetAllReferrals,
  adminGetReferralStats,
  adminGetReferralSettings,
  adminUpdateReferralSettings
} = require('../controllers/referralController');
const { protect, authorize, checkPermission } = require('../middleware/auth');

// Public route: Top referrers leaderboard
router.get('/leaderboard', getReferralLeaderboard);

// Protected routes (User/Customer context)
router.use(protect);
router.get('/wallet', getWallet);
router.get('/analytics', getReferralAnalytics);
router.get('/history', getReferralHistory);

// Admin-only management routes
router.post('/admin/adjust-wallet', authorize('admin'), checkPermission('referrals'), adminAdjustWallet);
router.get('/admin/logs', authorize('admin'), checkPermission('referrals'), adminGetAllReferrals);
router.get('/admin/stats', authorize('admin'), checkPermission('referrals'), adminGetReferralStats);
router.get('/admin/settings', authorize('admin'), checkPermission('referrals'), adminGetReferralSettings);
router.put('/admin/settings', authorize('admin'), checkPermission('referrals'), adminUpdateReferralSettings);

module.exports = router;
