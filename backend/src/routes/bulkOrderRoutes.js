const express = require('express');
const router = express.Router();
const { 
  createBulkOrder, 
  getAllBulkOrders, 
  seedBulkOrders, 
  clearBulkOrders,
  updateBulkOrderStatus,
  deleteBulkOrder
} = require('../controllers/bulkOrderController');
const { protect, authorize } = require('../middleware/auth');

// Public route for customers to create bulk orders
router.post('/', createBulkOrder);

// Protected Admin Routes
router.get('/', protect, authorize('admin'), getAllBulkOrders);
router.put('/:id', protect, authorize('admin'), updateBulkOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteBulkOrder);

// Dev/Admin Routes for testing
router.post('/seed', protect, authorize('admin'), seedBulkOrders);
router.delete('/clear', protect, authorize('admin'), clearBulkOrders);

module.exports = router;
