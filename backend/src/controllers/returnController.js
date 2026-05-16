const Return = require('../models/Return');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { processRefund } = require('../utils/paymentGateway');
const paginate = require('../utils/paginate');

// @desc    Request a return
// @route   POST /api/returns
// @access  Private (User)
exports.requestReturn = async (req, res, next) => {
  try {
    const { orderId, orderItemId, reason, description, images } = req.body;

    // Validate order
    const order = await Order.findOne({ _id: orderId, user: req.user.id });
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }

    if (order.status !== 'Delivered') {
      return res.status(400).json({ success: false, error: 'Only delivered orders can be returned' });
    }

    // Find the specific item in the order
    const itemIndex = order.orderItems.findIndex(item => item._id.toString() === orderItemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Item not found in order' });
    }

    const item = order.orderItems[itemIndex];

    if (item.returnStatus !== 'None' && item.returnStatus !== 'Rejected') {
      return res.status(400).json({ success: false, error: 'A return request already exists for this item' });
    }

    // Create Return request
    const returnRequest = await Return.create({
      order: orderId,
      orderItem: orderItemId,
      product: item.product,
      user: req.user.id,
      seller: item.seller,
      reason,
      description,
      images: images || [],
      refundAmount: item.price * item.quantity
    });

    // Update order item status
    order.orderItems[itemIndex].returnStatus = 'Requested';
    order.orderItems[itemIndex].returnRequest = returnRequest._id;
    await order.save();

    res.status(201).json({
      success: true,
      data: returnRequest
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'A return request already exists for this item' });
    }
    next(err);
  }
};

// @desc    Get logged in user's returns
// @route   GET /api/returns/my-returns
// @access  Private (User)
exports.getMyReturns = async (req, res, next) => {
  try {
    const populateOptions = [
      { path: 'product', select: 'name images' },
      { path: 'order', select: 'totalPrice createdAt' }
    ];
    
    const result = await paginate(Return, { user: req.user.id }, req, populateOptions);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller's returns
// @route   GET /api/returns/seller
// @access  Private (Seller)
exports.getSellerReturns = async (req, res, next) => {
  try {
    const populateOptions = [
      { path: 'product', select: 'name images' },
      { path: 'user', select: 'fullName email phone' },
      { path: 'order', select: 'shippingAddress createdAt' }
    ];
    
    const result = await paginate(Return, { seller: req.user.id }, req, populateOptions);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all returns
// @route   GET /api/returns
// @access  Private (Admin)
exports.getAllReturns = async (req, res, next) => {
  try {
    const populateOptions = [
      { path: 'product', select: 'name images' },
      { path: 'user', select: 'fullName email' },
      { path: 'seller', select: 'shopName fullName' }
    ];
    
    const result = await paginate(Return, {}, req, populateOptions);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update return status
// @route   PUT /api/returns/:id/status
// @access  Private (Seller/Admin)
exports.updateReturnStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;
    
    const returnReq = await Return.findById(req.params.id);
    if (!returnReq) {
      return res.status(404).json({ success: false, error: 'Return request not found' });
    }

    // Authorization check
    if (req.user.role === 'seller' && returnReq.seller.toString() !== req.user.id) {
      return res.status(403).json({ success: false, error: 'Not authorized to update this return' });
    }

    if (req.user.role === 'admin') {
      returnReq.adminComment = comment || returnReq.adminComment;
    } else if (req.user.role === 'seller') {
      returnReq.sellerComment = comment || returnReq.sellerComment;
    }

    returnReq.status = status;

    // Retrieve original order
    const order = await Order.findById(returnReq.order);
    const itemIndex = order.orderItems.findIndex(item => item._id.toString() === returnReq.orderItem.toString());
    
    if (itemIndex !== -1) {
      order.orderItems[itemIndex].returnStatus = status;
      await order.save();
    }

    // Process Refund & Stock Restore if Approved / Completed
    if (status === 'Approved' || status === 'Completed') {
      // 1. Process Refund
      if (returnReq.refundStatus === 'Pending') {
        try {
          const refundRes = await processRefund(
            order.paymentResult?.id || null, 
            returnReq.refundAmount, 
            returnReq._id
          );
          returnReq.refundStatus = 'Processed';
        } catch (error) {
          console.error('Refund processing error:', error);
          returnReq.refundStatus = 'Failed';
        }
      }

      // 2. Restore Stock
      const product = await Product.findById(returnReq.product);
      if (product && itemIndex !== -1) {
        product.countInStock += order.orderItems[itemIndex].quantity;
        await product.save();
      }
    }

    await returnReq.save();

    res.status(200).json({
      success: true,
      data: returnReq
    });
  } catch (err) {
    next(err);
  }
};
