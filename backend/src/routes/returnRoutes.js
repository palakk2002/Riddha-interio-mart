const express = require('express');
const {
  requestReturn,
  getMyReturns,
  getSellerReturns,
  getAllReturns,
  updateReturnStatus
} = require('../controllers/returnController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, requestReturn);
router.get('/my-returns', protect, getMyReturns);
router.get('/seller', protect, authorize('seller'), getSellerReturns);
router.get('/', protect, authorize('admin'), getAllReturns);
router.put('/:id/status', protect, authorize('seller', 'admin'), updateReturnStatus);

module.exports = router;
