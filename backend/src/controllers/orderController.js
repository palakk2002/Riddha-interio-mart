const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const { 
  notifySellerNewOrder, 
  notifyAdminNewOrder, 
  notifyDeliveryAssignment, 
  notifySellerDeliveryResponse,
  notifyAdminDeliveryResponse 
} = require('../socket');

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
    totalPrice,
    businessDetails
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  } else {
    try {
      // Enrich items with correct seller and sellerType from DB
      const enrichedItems = await Promise.all(orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        let sType = 'Seller';
        if (product) {
          sType = product.sellerType || (product.brand ? 'Admin' : 'Seller'); // Heuristic for old products
        }
        return {
          ...item,
          seller: product ? product.seller : (item.seller || item.productSeller),
          sellerType: product ? (product.sellerType || 'Seller') : (item.sellerType || 'Seller')
        };
      }));

      const primarySeller = enrichedItems[0].seller;
      const primarySellerType = enrichedItems[0].sellerType;

      const order = new Order({
        orderItems: enrichedItems,
        user: req.user.id,
        seller: primarySeller,
        sellerType: primarySellerType,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        isPaid: true,
        paidAt: Date.now(),
        status: 'Processing',
        businessDetails
      });

      const createdOrder = await order.save();

      // Clear the cart after order is placed
      await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

        // Real-time notify owners (Sellers and/or Admins)
        try {
          console.log('--- Order Notification Debug ---');
          const sellersToNotify = new Set();
          let isAdminNotified = false;

          createdOrder.orderItems.forEach(item => {
            console.log(`Checking Item: ${item.name}, SellerType: ${item.sellerType}, SellerID: ${item.seller}`);
            if (item.sellerType === 'Admin') {
              isAdminNotified = true;
            } else if (item.sellerType === 'Seller') {
              sellersToNotify.add(String(item.seller));
            }
          });

          const payload = {
            orderId: String(createdOrder._id),
            totalPrice: createdOrder.totalPrice,
            itemsCount: (createdOrder.orderItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0),
            status: createdOrder.status,
            createdAt: createdOrder.createdAt,
            customerName: req.user?.fullName,
            shippingCity: createdOrder.shippingAddress?.city
          };

          console.log('Notification Payload:', payload);

          // Notify specific sellers
          for (const sellerId of sellersToNotify) {
            console.log(`Emitting to Seller Room: seller:${sellerId}`);
            notifySellerNewOrder(sellerId, payload);
          }

          // Notify all admins if any admin-owned product was sold
          if (isAdminNotified) {
            console.log('Emitting to Admin Room: role:admin');
            notifyAdminNewOrder(null, payload);
          }
          console.log('--- End Notification Debug ---');
        } catch (e) {
          console.error('Socket notify failed:', e.message);
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
      .populate('seller', 'fullName shopName email phone shopAddress');

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
    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const isAdmin = userRole === 'admin';
    const isSeller = userRole === 'seller';
    const isDelivery = userRole === 'delivery';
    
    // If user is seller, only show orders belonging to them or containing their products
    if (isSeller) {
      query.$or = [
        { seller: req.user.id },
        { 'orderItems.seller': req.user.id }
      ];
    }

    // If user is delivery partner, show orders assigned to them or available in pool
    if (isDelivery) {
      query.$or = [
        { deliveryBoy: req.user.id },
        { deliveryStatus: { $in: ['None', 'Rejected'] } }
      ];
      query.status = { $in: ['Processing', 'Shipped', 'Delivered'] };
    }

    const orders = await Order.find(query)
      .populate('user', 'fullName email')
      .populate({
        path: 'seller',
        select: 'shopName fullName email',
        transform: (doc, id) => {
          if (!doc && id) return { _id: id, shopName: 'Riddha Mart (Admin)', fullName: 'Riddha Mart' };
          if (doc && !doc.shopName) return { ...doc.toObject(), shopName: 'Riddha Mart (Official)' };
          return doc;
        }
      })
      .populate('deliveryBoy', 'fullName email phone')
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
      const newStatus = req.body.status;
      order.status = newStatus || order.status;
      
      // Auto-sync deliveryStatus for tracking
      const deliveryTrackingStatuses = ['Picked', 'Out for Delivery', 'Delivered'];
      if (deliveryTrackingStatuses.includes(newStatus)) {
        order.deliveryStatus = newStatus;
      }

      if (newStatus === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.deliveryStatus = 'Delivered';
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

// @desc    Assign order to delivery boy
// @route   PUT /api/orders/:id/assign-delivery
// @access  Private/Seller
exports.assignOrderToDeliveryBoy = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const { deliveryBoyId } = req.body;
    order.deliveryBoy = deliveryBoyId;
    order.deliveryStatus = 'Pending';
    order.deliveryAssignmentTime = Date.now();

    await order.save();

    // Notify delivery boy
    notifyDeliveryAssignment(deliveryBoyId, {
      orderId: order._id,
      totalPrice: order.totalPrice,
      shippingAddress: order.shippingAddress,
      customerName: req.user.fullName
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Respond to delivery assignment
// @route   PUT /api/orders/:id/delivery-response
// @access  Private/Delivery
exports.respondToDeliveryAssignment = async (req, res) => {
  try {
    const { status } = req.body; // 'Accepted' or 'Rejected'
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.deliveryStatus = status;
    if (status === 'Accepted') {
      order.status = 'Shipped';
      order.deliveryBoy = req.user.id; // Ensure the delivery boy who accepted it is recorded
    } else {
      // If rejected, clear deliveryBoy so someone else can be assigned or it goes back to pool
      order.deliveryBoy = undefined;
    }

    await order.save();
    
    // Notify corresponding owner (Seller or Admin)
    const notificationPayload = {
      orderId: order._id,
      status: status,
      deliveryBoyName: req.user.fullName
    };

    if (order.sellerType === 'Admin') {
      notifyAdminDeliveryResponse(null, notificationPayload);
    } else {
      notifySellerDeliveryResponse(order.seller, notificationPayload);
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
