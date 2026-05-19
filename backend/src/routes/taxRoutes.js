const express = require('express');
const router = express.Router();
const {
  configureCategoryTax,
  configureProductTax,
  getTaxAuditLogs,
  getTaxSummary
} = require('../controllers/taxController');
const { protect, authorize } = require('../middleware/auth');

// Apply protection to all taxation routes
router.use(protect);

// Category and product configurations available for Admins and Sellers
router.post('/category', authorize('admin', 'seller'), configureCategoryTax);
router.post('/product', authorize('admin', 'seller'), configureProductTax);

// Immutable tax logs and aggregate summaries exclusive for Admins
router.get('/logs', authorize('admin'), getTaxAuditLogs);
router.get('/summary', authorize('admin'), getTaxSummary);

module.exports = router;
