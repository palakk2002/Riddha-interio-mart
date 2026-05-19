const Product = require('../models/Product');
const Seller = require('../models/Seller');
const paginate = require('../utils/paginate');

// @desc    Get all products (Filter by Verified Sellers only for Public)
exports.getProducts = async (req, res, next) => {
  try {
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(param => delete queryObj[param]);

    // Handle name/category searches if needed (simple match for now)
    // If isActive is not specified in query, default to true for public, but allow admin to see all
    // Sanitize Boolean Filters to avoid CastError
    const filter = {};
    
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    if (req.query.brand && req.query.brand !== 'all') {
      const mongoose = require('mongoose');
      if (mongoose.Types.ObjectId.isValid(req.query.brand)) {
        filter.brand = req.query.brand;
      } else {
        const Brand = require('../models/Brand');
        const foundBrand = await Brand.findOne({ name: { $regex: new RegExp(`^${req.query.brand.trim()}$`, 'i') } });
        if (foundBrand) {
          filter.brand = foundBrand._id;
        } else {
          // Brand name not found, query a non-existent ObjectId to return 0 results cleanly without throwing CastError
          filter.brand = new mongoose.Types.ObjectId();
        }
      }
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    // Default: only show approved products unless filter specifies otherwise
    // Admins can see everything
    const isAdmin = req.user && req.user.role === 'admin';
    
    if (!isAdmin) {
      filter.isApproved = true;
      filter.isActive = true;
    } else {
      // Admin filters
      if (req.query.isActive !== undefined && req.query.isActive !== 'all') {
        filter.isActive = req.query.isActive === 'true' || req.query.isActive === true;
      }
      
      if (req.query.isApproved !== undefined && req.query.isApproved !== 'all') {
        filter.isApproved = req.query.isApproved === 'true' || req.query.isApproved === true;
      }

      // Special case for approvalStatus string
      if (req.query.approvalStatus && req.query.approvalStatus !== 'all') {
        filter.approvalStatus = req.query.approvalStatus;
      }
    }

    // If text search is used, sort by score unless another sort is specified
    if (req.query.search && !req.query.sort) {
      req.query.sort = '-score';
      // In paginate util we don't have access to projection, but we can set lean()
    }

    const populateOptions = [
      { path: 'seller', select: 'fullName shopName' },
      { path: 'brand', select: 'name logo' }
    ];

    const result = await paginate(Product, filter, req, populateOptions);

    res.status(200).json({ 
      success: true, 
      count: result.data.length,
      totalResults: result.totalResults,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      data: result.data 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
exports.createProduct = async (req, res, next) => {
  try {
    const { source = 'new' } = req.body;
    
    // Automatically set seller and sellerType based on role if not provided
    if (!req.body.seller) {
      req.body.seller = req.user.id;
      req.body.sellerType = req.user.role === 'admin' ? 'Admin' : 'Seller';
    }

    // Handle Auto-approval logic
    // 1. Admin added products are auto-approved
    // 2. Catalog products are auto-approved
    // 3. New products from sellers need approval
    if (req.user.role === 'admin' || source === 'catalog') {
      req.body.isApproved = true;
      req.body.approvalStatus = 'approved';
    } else {
      req.body.isApproved = false;
      req.body.approvalStatus = 'pending';
    }

    // Set initial sellerPrice from the provided price
    if (req.body.price) {
      req.body.sellerPrice = req.body.price;
    }

    // 2. Create the product
    const product = await Product.create(req.body);

    // 3. Notify Admin if it's a new product from a seller needing approval
    if (req.user.role !== 'admin' && source === 'new') {
      const { notifyAdminNewProduct } = require('../socket');
      notifyAdminNewProduct({
        message: `New product "${product.name}" from ${req.user.shopName || req.user.fullName} needs approval.`,
        productId: product._id,
        sellerName: req.user. shopName || req.user.fullName
      });
    }
    
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, error: messages.join(', ') });
    }
    next(error);
  }
};

// @desc    Admin: Approve or Reject product
exports.updateApprovalStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { approvalStatus } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(approvalStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid approval status' });
    }

    const { adminCommission } = req.body;
    const updateData = {
      approvalStatus,
      isApproved: approvalStatus === 'approved'
    };

    if (adminCommission !== undefined) {
      updateData.adminCommission = adminCommission;
    }

    // Recalculate price if approved
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (approvalStatus === 'approved') {
      const commission = adminCommission !== undefined ? adminCommission : existingProduct.adminCommission;
      const sPrice = existingProduct.sellerPrice || existingProduct.price;
      updateData.price = Math.round(sPrice * (1 + commission / 100));
      updateData.sellerPrice = sPrice; // Ensure it's set
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Notify seller about approval/rejection
    const { notifySellerProductApproval } = require('../socket');
    notifySellerProductApproval(product.seller, {
      message: `Your product "${product.name}" has been ${approvalStatus}.`,
      productId: product._id,
      status: approvalStatus
    });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product details
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'fullName shopName isVerified')
      .populate('brand', 'name logo');
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Logic: Admin can see everything, others only see verified/approved products
    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = req.user && product.seller?._id?.toString() === req.user?.id;
    
    // Check Seller Verification (Skip if seller is Admin)
    const isSellerAdmin = product.sellerType === 'Admin';
    if (!isAdmin && !isOwner && !isSellerAdmin && !product.seller?.isVerified) {
       return res.status(401).json({ success: false, error: 'This product is currently unavailable (Seller verification pending)' });
    }

    // Check Product Approval
    if (!isAdmin && !isOwner && !product.isApproved) {
      return res.status(401).json({ success: false, error: 'This product is currently under review.' });
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
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Make sure user is product owner or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'User not authorized to delete this product' });
    }

    await Product.findByIdAndDelete(req.params.id);

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

    // If admin is updating, handle commission logic
    if (req.user.role === 'admin') {
      const { adminCommission, price: newPrice, sellerPrice: newSPrice } = req.body;
      
      const sPrice = newSPrice || product.sellerPrice || product.price;
      const commission = adminCommission !== undefined ? adminCommission : product.adminCommission;
      
      // If adminCommission was updated, recalculate price
      if (adminCommission !== undefined) {
        req.body.price = Math.round(sPrice * (1 + commission / 100));
        req.body.sellerPrice = sPrice;
      }
    } else {
      // If seller is updating, update sellerPrice instead of final price if they try to change price
      if (req.body.price) {
        req.body.sellerPrice = req.body.price;
        // Keep final price synced but wait for admin to re-approve or just keep commission the same
        req.body.price = Math.round(req.body.price * (1 + product.adminCommission / 100));
      }
      // Sellers shouldn't touch commission
      delete req.body.adminCommission;
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

// @desc    Create multiple products
// @route   POST /api/products/bulk
// @access  Private/Admin or Seller
exports.createBulkProducts = async (req, res, next) => {
  try {
    const { products } = req.body;
    const Brand = require('../models/Brand');

    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ success: false, error: 'Please provide an array of products' });
    }

    const seller = req.user.id;
    const sellerType = req.user.role === 'admin' ? 'Admin' : 'Seller';
    const isApproved = req.user.role === 'admin';
    const approvalStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const productsToCreate = await Promise.all(products.map(async (p, index) => {
      let brandId = p.brand;
      
      // If brand is a string (name), find or create it
      if (typeof p.brand === 'string' && p.brand.trim() !== '') {
        let brand = await Brand.findOne({ name: { $regex: new RegExp(`^${p.brand.trim()}$`, 'i') } });
        if (!brand) {
          console.log(`Creating new brand: ${p.brand.trim()}`);
          brand = await Brand.create({ name: p.brand.trim() });
        }
        brandId = brand._id;
      } else if (!p.brand) {
        let defaultBrand = await Brand.findOne({ name: 'General' });
        if (!defaultBrand) {
          defaultBrand = await Brand.create({ name: 'General' });
        }
        brandId = defaultBrand._id;
      }

      return {
        ...p,
        brand: brandId,
        seller,
        sellerType,
        isApproved,
        approvalStatus,
        sellerPrice: p.price,
        description: p.description || `${p.name} - Quality product from Riddha Mart.`
      };
    }));

    const createdProducts = await Product.insertMany(productsToCreate);

    res.status(201).json({
      success: true,
      count: createdProducts.length,
      data: createdProducts
    });
  } catch (error) {
    console.error('Bulk Create Error:', error.message);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      console.error('Validation Errors:', messages);
    }
    next(error);
  }
};

// @desc    Update stock for multiple products
// @route   PATCH /api/products/bulk-stock
// @access  Private/Admin or Seller
exports.updateBulkStock = async (req, res, next) => {
  try {
    const { updates } = req.body; // Array of { productId, newStock }
    const results = [];

    for (const update of updates) {
      const { productId, newStock } = update;
      
      const product = await Product.findById(productId);
      if (!product) {
        results.push({ productId, success: false, message: 'Product not found' });
        continue;
      }

      // Sellers can only update their own products
      if (req.user.role !== 'admin' && product.seller.toString() !== req.user.id) {
        results.push({ productId, success: false, message: 'Not authorized' });
        continue;
      }

      product.countInStock = newStock;
      await product.save();
      results.push({ productId, success: true, countInStock: newStock });
    }

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};
