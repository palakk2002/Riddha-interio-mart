const express = require('express');
const { registerDelivery, loginDelivery, getDeliveryMe } = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerDelivery);
router.post('/login', loginDelivery);
router.get('/me', protect, getDeliveryMe);

module.exports = router;
