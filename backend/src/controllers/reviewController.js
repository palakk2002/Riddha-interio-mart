const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const paginate = require('../utils/paginate');

// @desc    Get reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
exports.getReviews = async (req, res) => {
  try {
    const query = { product: req.params.productId, isApproved: true };

    const populateOptions = { path: 'user', select: 'fullName avatar' };
    const result = await paginate(Review, query, req, populateOptions);

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
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add review
// @route   POST /api/products/:productId/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already submitted a review
    const alreadyReviewed = await Review.findOne({ user: userId, product: productId });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'Product already reviewed' });
    }

    // Check for verified purchase
    // User must have an order with this product that is Delivered
    const orders = await Order.find({ user: userId, status: 'Delivered' });
    let isVerified = false;
    for (const order of orders) {
      const foundItem = order.orderItems.find(item => item.product.toString() === productId);
      if (foundItem) {
        isVerified = true;
        break;
      }
    }

    const reviewData = {
      ...req.body,
      product: productId,
      user: userId,
      verifiedPurchase: isVerified
    };

    const review = await Review.create(reviewData);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Make sure review belongs to user
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to update review' });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // Manually trigger static method to recalculate averages since findByIdAndUpdate doesn't trigger post('save') automatically unless configured.
    // However, our model has post('save'). We can just save it instead of findByIdAndUpdate.
    
    // Actually, let's use document.save() to trigger hooks properly.
    review.rating = req.body.rating || review.rating;
    review.title = req.body.title || review.title;
    review.review = req.body.review || review.review;
    if (req.body.images) review.images = req.body.images;

    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: 'Not authorized to delete review' });
    }

    await review.deleteOne(); // Triggers post('remove') hook in Mongoose 6+ (Actually, deleteOne middleware is different. Let's use findOneAndDelete hook or call manually).

    // Call static method manually to be safe
    await Review.getAverageRating(review.product);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Hide/Approve review (Admin only)
// @route   PUT /api/reviews/:id/moderation
// @access  Private/Admin
exports.moderateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.isApproved = req.body.isApproved;
    await review.save(); // Triggers getAverageRating because of save hook!

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
