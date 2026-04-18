const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');

router.use(protect); // All cart routes are protected

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/:productId')
  .put(updateQuantity)
  .delete(removeFromCart);

module.exports = router;
