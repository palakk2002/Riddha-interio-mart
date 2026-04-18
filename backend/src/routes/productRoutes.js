const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  getSellerProducts,
  deleteProduct,
  updateProduct,
  updateApprovalStatus
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), createProduct);

router.get('/my-products', protect, authorize('seller'), getSellerProducts);

router.put('/:id/approval', protect, authorize('admin'), updateApprovalStatus);

router.route('/:id')
  .get(getProduct)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;
