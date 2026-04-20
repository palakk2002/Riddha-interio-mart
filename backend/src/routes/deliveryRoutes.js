const express = require('express');
const { 
  registerDelivery, 
  loginDelivery, 
  getDeliveryMe, 
  getAvailableDeliveryBoys, 
  updateDeliveryStatus,
  getAllDeliveryPartners,
  updateDeliveryApprovalStatus
} = require('../controllers/deliveryController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerDelivery);
router.post('/login', loginDelivery);
router.get('/me', protect, getDeliveryMe);
router.get('/available', protect, getAvailableDeliveryBoys);
router.put('/status', protect, updateDeliveryStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getAllDeliveryPartners);
router.put('/:id/approve', protect, authorize('admin'), updateDeliveryApprovalStatus);

module.exports = router;
