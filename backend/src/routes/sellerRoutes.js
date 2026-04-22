const express = require('express');
const { registerSeller, loginSeller, getSellerMe, updateSellerProfile } = require('../controllers/sellerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/me', protect, getSellerMe);
router.put('/profile', protect, updateSellerProfile);

module.exports = router;
