const express = require('express');
const { registerSeller, loginSeller, getSellerMe } = require('../controllers/sellerController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerSeller);
router.post('/login', loginSeller);
router.get('/me', protect, getSellerMe);

module.exports = router;
