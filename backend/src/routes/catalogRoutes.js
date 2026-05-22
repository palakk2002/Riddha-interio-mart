const express = require('express');
const {
  getCatalogItems,
  getCatalogItem,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
  checkCatalogSku
} = require('../controllers/catalogController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/check-sku/:sku')
  .get(protect, authorize('admin'), checkCatalogSku);

router.route('/')
  .get(getCatalogItems)
  .post(protect, authorize('admin'), createCatalogItem);

router.route('/:id')
  .get(getCatalogItem)
  .put(protect, authorize('admin'), updateCatalogItem)
  .delete(protect, authorize('admin'), deleteCatalogItem);

module.exports = router;
