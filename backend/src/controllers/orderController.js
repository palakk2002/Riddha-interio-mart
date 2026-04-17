const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { notifySellerNewOrder } = require('../socket');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  } else {
    try {
      // Extract ID if seller is a populated object
      const getSellerId = (s) => (s && s._id) ? s._id : s;
      const primarySeller = getSellerId(orderItems[0].seller || orderItems[0].productSeller); 

      const order = new Order({
        orderItems: orderItems.map(item => ({
          ...item,
          seller: getSellerId(item.seller || item.productSeller) // Ensure each item has its seller ID
        })),
        user: req.user.id,
        seller: primarySeller, // Link main order to a seller
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),
        status: 'Processing'
      });

      const createdOrder = await order.save();

      // Clear the cart after order is placed
      await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

      // Real-time notify seller(s)
      try {
        const sellerIds = new Set(
          (createdOrder.orderItems || [])
            .map((item) => (item && item.seller ? String(item.seller) : null))
            .filter(Boolean)
        );

        // Fallback to top-level order.seller
        if (createdOrder.seller) sellerIds.add(String(createdOrder.seller));

        const payload = {
          orderId: String(createdOrder._id),
          totalPrice: createdOrder.totalPrice,
          itemsCount: (createdOrder.orderItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
          status: createdOrder.status,
          createdAt: createdOrder.createdAt,
          customerName: req.user?.fullName,
          shippingCity: createdOrder.shippingAddress?.city
        };

        for (const sellerId of sellerIds) {
          notifySellerNewOrder(sellerId, payload);
        }
      } catch (e) {
        // Never block order placement due to realtime failures
        console.warn('Socket notify failed:', e.message);
      }

      res.status(201).json({
        success: true,
        data: createdOrder
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'fullName email')
      .populate('seller', 'shopName email phone shopAddress');

    if (order) {
      res.status(200).json({
        success: true,
        data: order
      });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders (Admin/Seller)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const query = {};
    
    // If user is seller, only show orders belonging to them or containing their products
    if (req.user.role === 'seller') {
      const sellerId = req.user.id;
      query.$or = [
        { seller: sellerId },
        { "orderItems.seller": sellerId }
      ];
    }
    
    const orders = await Order.find(query)
      .populate('user', 'fullName email')
      .populate('seller', 'shopName email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      
      if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
