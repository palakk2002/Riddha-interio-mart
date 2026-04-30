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
    const User = require('../models/User');
    const Delivery = require('../models/Delivery');

    const [
      productsCount,
      categoriesCount,
      sellersCount,
      usersCount,
      deliveryCount,
      revenueData,
      recentOrders,
      orderStatusCounts,
      paymentMethodCounts,
      userTypeCounts
    ] = await Promise.all([
      Catalog.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Seller.countDocuments({ isVerified: true }),
      User.countDocuments({ role: 'user' }),
      Delivery.countDocuments({ approvalStatus: 'Approved' }),
      Order.aggregate([
        { $match: { status: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      Order.find()
        .populate('user', 'fullName')
        .sort('-createdAt')
        .limit(8),
      Order.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $match: { role: 'user' } },
        { $group: { _id: "$userType", count: { $sum: 1 } } }
      ])
    ]);

    // Calculate revenue for last 7 days for graph
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'Cancelled' } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Fill in missing days with zero revenue
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayData = dailyStats.find(s => s._id === dateStr);
      chartData.push({
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        revenue: dayData ? dayData.revenue : 0,
        orders: dayData ? dayData.orders : 0
      });
    }

    res.status(200).json({
      success: true,
      data: {
        stats: {
          products: productsCount,
          categories: categoriesCount,
          sellers: sellersCount,
          users: usersCount,
          delivery: deliveryCount,
          totalRevenue: revenueData[0]?.total || 0,
          statusBreakdown: orderStatusCounts,
          paymentBreakdown: paymentMethodCounts,
          userTypeBreakdown: userTypeCounts
        },
        revenueChart: chartData,
        recentActivity: recentOrders.map(o => ({
          id: o._id,
          action: `Order ${o.status}`,
          target: `#${o._id.toString().slice(-6).toUpperCase()}`,
          user: o.user?.fullName || 'Customer',
          time: o.createdAt,
          amount: o.totalPrice
        }))
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

// --- Assistant Management ---
// @desc    Create a new assistant
// @route   POST /api/auth/admin/assistants
// @access  Private/Admin
exports.createAssistant = async (req, res, next) => {
  try {
    const { name, email, password, permissions } = req.body;
    
    if (await checkEmailExists(email)) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const assistant = await Admin.create({
      fullName: name,
      email,
      password,
      type: 'assistant',
      permissions
    });

    res.status(201).json({ success: true, data: assistant });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all assistants
// @route   GET /api/auth/admin/assistants
// @access  Private/Admin
exports.getAssistants = async (req, res, next) => {
  try {
    const assistants = await Admin.find({ type: 'assistant' });
    res.status(200).json({ success: true, data: assistants });
  } catch (err) {
    next(err);
  }
};

// @desc    Update assistant
// @route   PUT /api/auth/admin/assistants/:id
// @access  Private/Admin
exports.updateAssistant = async (req, res, next) => {
  try {
    const { name, email, password, permissions } = req.body;
    const updateData = { fullName: name, email, permissions };
    
    if (password) {
      updateData.password = password;
    }

    const assistant = await Admin.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    if (!assistant) return res.status(404).json({ success: false, error: 'Assistant not found' });
    
    res.status(200).json({ success: true, data: assistant });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete assistant
// @route   DELETE /api/auth/admin/assistants/:id
// @access  Private/Admin
exports.deleteAssistant = async (req, res, next) => {
  try {
    const assistant = await Admin.findByIdAndDelete(req.params.id);
    if (!assistant) return res.status(404).json({ success: false, error: 'Assistant not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// --- User/Customer Management ---
// @desc    Get all users by type
// @route   GET /api/auth/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { userType } = req.query;
    const User = require('../models/User');
    const Order = require('../models/Order');
    const query = { role: 'user' };
    if (userType) query.userType = userType;
    
    let users = await User.find(query).sort('-createdAt').lean();
    
    // Add order counts
    users = await Promise.all(users.map(async (user) => {
      const orderCount = await Order.countDocuments({ user: user._id });
      return { ...user, totalOrders: orderCount };
    }));

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// --- Payment Management ---

// @desc    Get all cash collections from delivery boys
// @route   GET /api/auth/admin/payments/delivery
// @access  Private/Admin
exports.getCashCollections = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    
    // Aggregate by delivery boy for orders that are COD and Delivered but cash not deposited
    const collections = await Order.aggregate([
      {
        $match: {
          paymentMethod: 'COD',
          deliveryStatus: 'Delivered',
          deliveryBoy: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$deliveryBoy',
          totalAmount: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          undepositedAmount: {
            $sum: { $cond: [{ $eq: ['$isCashDeposited', false] }, '$totalPrice', 0] }
          },
          lastDeliveredAt: { $max: '$deliveredAt' }
        }
      },
      {
        $lookup: {
          from: 'deliveries',
          localField: '_id',
          foreignField: '_id',
          as: 'deliveryBoyInfo'
        }
      },
      { $unwind: '$deliveryBoyInfo' },
      {
        $project: {
          _id: 1,
          name: '$deliveryBoyInfo.fullName',
          amount: '$undepositedAmount',
          totalCollected: '$totalAmount',
          orders: '$orderCount',
          date: '$lastDeliveredAt',
          status: { $cond: [{ $gt: ['$undepositedAmount', 0] }, 'In Hand', 'Deposited'] }
        }
      }
    ]);

    res.status(200).json({ success: true, data: collections });
  } catch (err) {
    next(err);
  }
};

// @desc    Confirm cash deposit for all pending orders of a delivery boy
// @route   PUT /api/auth/admin/payments/delivery/confirm/:deliveryBoyId
// @access  Private/Admin
exports.confirmCashDeposit = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    await Order.updateMany(
      { 
        deliveryBoy: req.params.deliveryBoyId, 
        paymentMethod: 'COD', 
        deliveryStatus: 'Delivered',
        isCashDeposited: false 
      },
      { $set: { isCashDeposited: true } }
    );

    res.status(200).json({ success: true, message: 'Cash deposit confirmed' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller transactions/payouts summary
// @route   GET /api/auth/admin/payments/sellers
// @access  Private/Admin
exports.getSellerTransactions = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    
    // Group by seller to calculate earnings (assuming 10% commission for now)
    const transactions = await Order.aggregate([
      {
        $match: {
          isPaid: true,
          sellerType: 'Seller'
        }
      },
      {
        $group: {
          _id: '$seller',
          totalSales: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 },
          lastSaleDate: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'sellers',
          localField: '_id',
          foreignField: '_id',
          as: 'sellerInfo'
        }
      },
      { $unwind: '$sellerInfo' },
      {
        $project: {
          _id: 1,
          sellerName: '$sellerInfo.fullName',
          shopName: '$sellerInfo.shopName',
          amount: { $multiply: ['$totalSales', 0.9] }, // 90% to seller
          commission: { $multiply: ['$totalSales', 0.1] }, // 10% commission
          status: 'Completed',
          type: 'Payout',
          date: '$lastSaleDate'
        }
      }
    ]);

    res.status(200).json({ success: true, data: transactions });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete/Block user
// @route   DELETE /api/auth/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc    Search orders for suggestions
// @route   GET /api/auth/admin/orders/search
// @access  Private/Admin
exports.searchOrders = async (req, res, next) => {
  try {
    const mongoose = require('mongoose');
    const { query } = req.query;
    if (!query) return res.status(200).json({ success: true, data: [] });

    const Order = require('../models/Order');
    
    // Search by ID (if valid hex string of length 24) or customer name
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(query);
    
    const searchQuery = {
      $or: [
        ...(isObjectId ? [{ _id: query }] : []),
        { 'shippingAddress.fullName': { $regex: query, $options: 'i' } }
      ]
    };

    const orders = await Order.find(searchQuery)
      .limit(5)
      .select('_id totalPrice status createdAt shippingAddress.fullName')
      .populate('user', 'fullName');

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};
