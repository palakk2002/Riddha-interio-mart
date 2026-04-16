const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  getSellerProducts
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProducts)
  .post(protect, authorize('seller', 'admin'), createProduct);

router.get('/my-products', protect, authorize('seller'), getSellerProducts);

router.route('/:id')
  .get(getProduct);

module.exports = router;
