const express = require('express');
const router = express.Router();
const { createBulkOrder, getAllBulkOrders, seedBulkOrders, clearBulkOrders } = require('../controllers/bulkOrderController');

router.post('/', createBulkOrder);
router.get('/', getAllBulkOrders);
router.post('/seed', seedBulkOrders);
router.delete('/clear', clearBulkOrders);

module.exports = router;
