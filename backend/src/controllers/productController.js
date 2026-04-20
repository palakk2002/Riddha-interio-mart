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
    // Sanitize Boolean Filters to avoid CastError
    const filter = {};
    
    if (req.query.category && req.query.category !== 'all') {
      filter.category = req.query.category;
    }
    
    if (req.query.brand && req.query.brand !== 'all') {
      filter.brand = req.query.brand;
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

    // Newest first by default
    const sortBy = req.query.sort || '-createdAt';
    const products = await Product.find(filter)
      .sort(sortBy)
      .populate('seller', 'fullName shopName');

    res.status(200).json({ success: true, count: products.length, data: products });
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

    const product = await Product.findByIdAndUpdate(id, {
      approvalStatus,
      isApproved: approvalStatus === 'approved'
    }, { new: true });

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
    const product = await Product.findById(req.params.id).populate('seller', 'fullName shopName isVerified');
    
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
