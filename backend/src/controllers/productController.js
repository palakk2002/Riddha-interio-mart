const Product = require('../models/Product');
const Seller = require('../models/Seller');

// @desc    Get all products (Filter by Verified Sellers only for Public)
exports.getProducts = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(param => delete queryObj[param]);

    // Handle name/category searches if needed (simple match for now)
    // If isActive is not specified in query, default to true for public, but allow admin to see all
    const filter = { ...queryObj };
    if (filter.isActive === undefined) {
      filter.isActive = true;
    } else if (filter.isActive === 'all') {
      delete filter.isActive;
    }

    const products = await Product.find(filter).populate('seller', 'fullName shopName');

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
exports.createProduct = async (req, res, next) => {
  try {
    // Automatically set seller and sellerType based on role if not provided
    if (!req.body.seller) {
      req.body.seller = req.user.id;
      req.body.sellerType = req.user.role === 'admin' ? 'Admin' : 'Seller';
    } else {
      // If seller ID is provided (e.g. by admin assigning to someone else), 
      // we assume it's a 'Seller' unless specified
      if (!req.body.sellerType) {
        req.body.sellerType = 'Seller';
      }
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

// @desc    Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    console.log('Delete request received for ID:', req.params.id);
    const product = await Product.findById(req.params.id);

    if (!product) {
      console.log('Product not found in DB');
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Make sure user is product owner or admin
    console.log('Product seller:', product.seller.toString(), 'Current user:', req.user.id);
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      console.log('Unauthorized delete attempt');
      return res.status(401).json({ success: false, error: 'User not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);
    console.log('Product successfully deleted from DB');

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete controller error:', error);
    next(error);
  }
};

// @desc    Update product
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Make sure user is product owner or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'User not authorized to update this product' });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};
