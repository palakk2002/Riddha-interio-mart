const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist
} = require('../controllers/wishlistController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('user')); // Only authenticated users can manage wishlists

router.route('/')
  .get(getWishlist);

router.route('/:productId')
  .post(addToWishlist)
  .delete(removeFromWishlist);

module.exports = router;
