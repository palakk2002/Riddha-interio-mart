const express = require('express');
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminMe,
  updateAdminProfile,
  getPendingSellers,
  getActiveSellers,
  approveSeller,
  deleteSeller,
  suspendSeller,
  unsuspendSeller,
  getDashboardStats,
  getStockStatus,
  getAssistants,
  createAssistant,
  updateAssistant,
  deleteAssistant,
  getUsers,
  updateUser,
  deleteUser,
  getCashCollections,
  confirmCashDeposit,
  getSellerTransactions,
  searchOrders,
  getActivityLogs
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validate
], loginAdmin);
router.get('/me', protect, getAdminMe);
router.put('/profile', protect, updateAdminProfile);

// Search suggestions
router.get('/orders/search', protect, authorize('admin'), searchOrders);

// Seller Management routes (Admin only)
router.get('/sellers/pending', protect, authorize('admin'), getPendingSellers);
router.get('/sellers/active', protect, authorize('admin'), getActiveSellers);
router.put('/sellers/:id/approve', protect, authorize('admin'), approveSeller);
router.delete('/sellers/:id', protect, authorize('admin'), deleteSeller);
router.put('/sellers/:id/suspend', protect, authorize('admin'), suspendSeller);
router.put('/sellers/:id/unsuspend', protect, authorize('admin'), unsuspendSeller);
router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);
router.get('/stock-status', protect, authorize('admin'), getStockStatus);

// Assistant Management routes (Superadmin only or restricted)
router.get('/assistants', protect, authorize('admin'), getAssistants);
router.post('/assistants', protect, authorize('admin'), createAssistant);
router.put('/assistants/:id', protect, authorize('admin'), updateAssistant);
router.delete('/assistants/:id', protect, authorize('admin'), deleteAssistant);
router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id', protect, authorize('admin'), updateUser);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Payment Management
router.get('/payments/delivery', protect, authorize('admin'), getCashCollections);
router.put('/payments/delivery/confirm/:deliveryBoyId', protect, authorize('admin'), confirmCashDeposit);
router.get('/payments/sellers', protect, authorize('admin'), getSellerTransactions);

// Activity Logs route
router.get('/activity-logs', protect, authorize('admin'), getActivityLogs);

module.exports = router;
