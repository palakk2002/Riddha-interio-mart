const express = require('express');
const { 
  registerAdmin, 
  loginAdmin, 
  getAdminMe,
  getPendingSellers,
  getActiveSellers,
  approveSeller,
  deleteSeller
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, getAdminMe);

// Seller Management routes (Admin only)
router.get('/sellers/pending', protect, authorize('admin'), getPendingSellers);
router.get('/sellers/active', protect, authorize('admin'), getActiveSellers);
router.put('/sellers/:id/approve', protect, authorize('admin'), approveSeller);
router.delete('/sellers/:id', protect, authorize('admin'), deleteSeller);

module.exports = router;
