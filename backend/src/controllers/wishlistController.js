const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50; // default large limit for wishlists
    const startIndex = (page - 1) * limit;

    const wishlistDocs = await Wishlist.find({ user: req.user.id })
      .populate('product')
      .sort('-createdAt')
      .skip(startIndex)
      .limit(limit);

    // Auto-cleanup: if a product was deleted from DB, it will populate as null
    // We should filter these out and optionally delete the orphaned wishlist items
    const validWishlistItems = [];
    const orphanedIds = [];

    wishlistDocs.forEach(item => {
      if (item.product === null) {
        orphanedIds.push(item._id);
      } else {
        // Return just the product details for the frontend to easily map over
        validWishlistItems.push(item.product);
      }
    });

    // Cleanup orphaned references asynchronously
    if (orphanedIds.length > 0) {
      Wishlist.deleteMany({ _id: { $in: orphanedIds } }).catch(console.error);
    }

    const total = await Wishlist.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: validWishlistItems.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      data: validWishlistItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Add to wishlist
    const wishlistItem = await Wishlist.create({
      user: req.user.id,
      product: productId
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    // 11000 is duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product already in wishlist' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const result = await Wishlist.findOneAndDelete({
      user: req.user.id,
      product: productId
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'Product not found in wishlist' });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
