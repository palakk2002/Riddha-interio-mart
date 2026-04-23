const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const sendTokenResponse = require('../utils/sendTokenResponse');
const checkEmailExists = require('../utils/checkEmailExists');

// @desc    Register Admin
exports.registerAdmin = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (await checkEmailExists(email)) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    const admin = await Admin.create({ fullName, email, password });
    sendTokenResponse(admin, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login Admin
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    sendTokenResponse(admin, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in Admin
exports.getAdminMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.user.id);
    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

// --- Seller Management ---

// @desc    Get all pending sellers
exports.getPendingSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find({ isVerified: false }).sort('-createdAt');
    res.status(200).json({ success: true, data: sellers });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all active (verified) sellers
exports.getActiveSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find({ isVerified: true }).sort('-createdAt');
    res.status(200).json({ success: true, data: sellers });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve a seller registration
exports.approveSeller = async (req, res, next) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, { isVerified: true }, { new: true });
    if (!seller) return res.status(404).json({ success: false, error: 'Seller not found' });
    res.status(200).json({ success: true, data: seller });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete/Reject a seller registration
exports.deleteSeller = async (req, res, next) => {
  try {
    const seller = await Seller.findByIdAndDelete(req.params.id);
    if (!seller) return res.status(404).json({ success: false, error: 'Seller not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Admin Profile
exports.updateAdminProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      fullName: req.body.fullName,
      email: req.body.email,
      phone: req.body.phone,
      department: req.body.department,
      avatar: req.body.avatar
    };

    const admin = await Admin.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: admin });
  } catch (err) {
    next(err);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/auth/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res, next) => {
  try {
    const Catalog = require('../models/Catalog');
    const Category = require('../models/Category');
    const Seller = require('../models/Seller');
    const Order = require('../models/Order');

    const [productsCount, categoriesCount, sellersCount, movingOrders, allRecentOrders] = await Promise.all([
      Catalog.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Seller.countDocuments({ isVerified: true }),
      Order.countDocuments({ status: { $in: ['Shipped', 'Out for Delivery'] } }),
      Order.find()
        .populate('user', 'fullName')
        .sort('-createdAt')
        .limit(5)
    ]);

    // Process recent activity from all recent orders
    const recentActivity = allRecentOrders.map(o => ({
      id: o._id,
      action: o.status === 'Processing' ? 'New Order Placed' : `Order ${o.status}`,
      target: `#${o.orderId || o._id.toString().slice(-8).toUpperCase()}`,
      user: o.user?.fullName || 'Customer',
      time: o.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        products: productsCount,
        categories: categoriesCount,
        sellers: sellersCount,
        activeDeliveries: movingOrders,
        recentActivity
      }
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get stock management report
// @route   GET /api/auth/admin/stock-status
// @access  Private/Admin
exports.getStockStatus = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const products = await Product.find()
      .populate('seller', 'shopName fullName')
      .populate('brand', 'name')
      .sort('countInStock');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};
