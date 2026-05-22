const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  getSellerProducts,
  deleteProduct,
  updateProduct,
  updateApprovalStatus,
  updateBulkStock,
  getSearchSuggestions,
  checkProductSku
} = require('../controllers/productController');
const { protect, authorize, tryProtect } = require('../middleware/auth');
const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

// Include other resource routers
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:productId/reviews', reviewRouter);

router.get('/check-sku/:sku', protect, authorize('seller', 'admin'), checkProductSku);

router.get('/add-dummy-products', async (req, res) => {
  try {
    const Seller = require('../models/Seller');
    const Product = require('../models/Product');
    const Brand = require('../models/Brand');
    
    const seller = await Seller.findOne({ email: 'sheetal12@gmail.com' });
    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    
    let brand = await Brand.findOne();
    if (!brand) {
      brand = await Brand.create({ name: 'Sheetal Brand', image: 'dummy.jpg', isActive: true });
    }
    
    for (let i = 1; i <= 5; i++) {
      await Product.create({
        name: `Sheetal Product ${i}`,
        description: `details sheetal for product ${i}`,
        price: 100 + i * 10,
        category: 'Furniture',
        brand: brand._id,
        countInStock: 50,
        seller: seller._id,
        sellerType: 'Seller',
        approvalStatus: 'approved',
        isApproved: true,
        images: ['https://via.placeholder.com/150']
      });
    }
    res.json({ success: true, message: 'Added 5 products' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.route('/')
  .get(tryProtect, getProducts)
  .post(protect, authorize('seller', 'admin'), [
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    validate
  ], createProduct);

router.get('/search/suggestions', tryProtect, getSearchSuggestions);

router.post('/bulk', protect, authorize('seller', 'admin'), require('../controllers/productController').createBulkProducts);

router.patch('/bulk-stock', protect, authorize('seller', 'admin'), [
  check('updates', 'Updates array is required').isArray({ min: 1 }),
  validate
], updateBulkStock);

router.get('/my-products', protect, authorize('seller', 'admin'), getSellerProducts);

router.put('/:id/approval', protect, authorize('admin'), updateApprovalStatus);

router.route('/:id')
  .get(tryProtect, getProduct)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;
