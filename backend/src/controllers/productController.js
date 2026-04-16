const Product = require('../models/Product');
const Seller = require('../models/Seller');

// @desc    Get all products (Filter by Verified Sellers only for Public)
exports.getProducts = async (req, res, next) => {
  try {
    const verifiedSellers = await Seller.find({ isVerified: true }).select('_id');
    const verifiedSellerIds = verifiedSellers.map(s => s._id);

    const products = await Product.find({ 
      seller: { $in: verifiedSellerIds },
      isActive: true 
    }).populate('seller', 'fullName shopName');

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
exports.createProduct = async (req, res, next) => {
  try {
    // 1. Determine Seller ID
    if (req.user.role === 'seller') {
      req.body.seller = req.user.id;
    }

    if (!req.body.seller) {
      return res.status(400).json({ success: false, error: 'Seller ID is required to create a product' });
    }

    // 2. Create the product
    const product = await Product.create(req.body);
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Get single product details
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'fullName shopName isVerified');
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Logic: Admin can see everything, others only see verified products
    const isAdmin = req.user && req.user.role === 'admin';
    if (!isAdmin && !product.seller.isVerified) {
       return res.status(401).json({ success: false, error: 'This product is currently unavailable (Seller verification pending)' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for the logged in seller
exports.getSellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};
