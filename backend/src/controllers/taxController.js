const Category = require('../models/Category');
const Product = require('../models/Product');
const TaxAuditLog = require('../models/TaxAuditLog');

/**
 * @desc    Configure category default tax rule
 * @route   POST /api/tax/category
 * @access  Private (Admin/Seller)
 */
exports.configureCategoryTax = async (req, res, next) => {
  try {
    const { categoryName, defaultGstRate } = req.body;
    if (!categoryName || defaultGstRate === undefined) {
      return res.status(400).json({ success: false, error: 'Please provide categoryName and defaultGstRate' });
    }

    const category = await Category.findOneAndUpdate(
      { name: categoryName },
      { defaultGstRate: Number(defaultGstRate) },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Category default GST rate successfully updated.',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Configure product explicit tax rate
 * @route   POST /api/tax/product
 * @access  Private (Admin/Seller)
 */
exports.configureProductTax = async (req, res, next) => {
  try {
    const { productId, gstRate } = req.body;
    if (!productId || gstRate === undefined) {
      return res.status(400).json({ success: false, error: 'Please provide productId and gstRate' });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { gstRate: Number(gstRate) },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product GST rate successfully configured.',
      data: product
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get all tax audit logs
 * @route   GET /api/tax/logs
 * @access  Private (Admin)
 */
exports.getTaxAuditLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const total = await TaxAuditLog.countDocuments();
    const logs = await TaxAuditLog.find()
      .populate('order', 'totalPrice status')
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      count: logs.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: logs
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc    Get comprehensive tax audit summary for analytics
 * @route   GET /api/tax/summary
 * @access  Private (Admin)
 */
exports.getTaxSummary = async (req, res, next) => {
  try {
    const summary = await TaxAuditLog.aggregate([
      {
        $group: {
          _id: '$transactionType',
          totalAmount: { $sum: '$totalAmount' },
          taxableAmount: { $sum: '$taxableAmount' },
          cgst: { $sum: '$cgst' },
          sgst: { $sum: '$sgst' },
          igst: { $sum: '$igst' },
          totalTax: { $sum: '$totalTax' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (err) {
    next(err);
  }
};
