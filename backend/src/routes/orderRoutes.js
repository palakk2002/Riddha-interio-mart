const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getOrders)
  .post(addOrderItems);

router.route('/my-orders').get(getMyOrders);

router.route('/:id/status')
  .put(updateOrderStatus);

router.route('/:id').get(getOrderById);

module.exports = router;
