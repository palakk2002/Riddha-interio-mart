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
  getDashboardStats,
  getStockStatus,
  getAssistants,
  createAssistant,
  updateAssistant,
  deleteAssistant,
  getUsers,
  deleteUser,
  getCashCollections,
  confirmCashDeposit,
  getSellerTransactions,
  searchOrders
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getAdminMe);
router.put('/profile', protect, updateAdminProfile);

// Search suggestions
router.get('/orders/search', protect, authorize('admin'), searchOrders);

// Seller Management routes (Admin only)
router.get('/sellers/pending', protect, authorize('admin'), getPendingSellers);
router.get('/sellers/active', protect, authorize('admin'), getActiveSellers);
router.put('/sellers/:id/approve', protect, authorize('admin'), approveSeller);
router.delete('/sellers/:id', protect, authorize('admin'), deleteSeller);
router.get('/dashboard-stats', protect, authorize('admin'), getDashboardStats);
router.get('/stock-status', protect, authorize('admin'), getStockStatus);

// Assistant Management routes (Superadmin only or restricted)
router.get('/assistants', protect, authorize('admin'), getAssistants);
router.post('/assistants', protect, authorize('admin'), createAssistant);
router.put('/assistants/:id', protect, authorize('admin'), updateAssistant);
router.delete('/assistants/:id', protect, authorize('admin'), deleteAssistant);
router.get('/users', protect, authorize('admin'), getUsers);
router.delete('/users/:id', protect, authorize('admin'), deleteUser);

// Payment Management
router.get('/payments/delivery', protect, authorize('admin'), getCashCollections);
router.put('/payments/delivery/confirm/:deliveryBoyId', protect, authorize('admin'), confirmCashDeposit);
router.get('/payments/sellers', protect, authorize('admin'), getSellerTransactions);

module.exports = router;
