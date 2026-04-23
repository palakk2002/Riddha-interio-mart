const express = require('express');
const { registerSeller, loginSeller, getSellerMe, updateSellerProfile, getSellerStockStatus } = require('../controllers/sellerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/me', protect, getSellerMe);
router.put('/profile', protect, updateSellerProfile);
router.get('/stock-status', protect, getSellerStockStatus);

module.exports = router;
