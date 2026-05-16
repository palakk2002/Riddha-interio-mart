const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const Seller = require('../models/Seller');
const paginate = require('../utils/paginate');
const { 
  notifySellerNewOrder, 
  notifyAdminNewOrder, 
  notifyDeliveryAssignment, 
  notifySellerDeliveryResponse,
  notifyAdminDeliveryResponse,
  notifyUserOrderStatus,
  notifyLowStock
} = require('../socket');
const { processInvoiceAsync } = require('../utils/invoiceService');

// @desc    Create new order(s) handling multi-seller cart
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    businessDetails
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  try {
    // 1. Stock Validation (Fail-Fast: if any item is out of stock, fail entire order)
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name}` });
      }
      if (product.countInStock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Insufficient stock for ${item.name}. Available: ${product.countInStock}` 
        });
      }
    }

    // 2. Group items by Seller
    const groupedItems = {};
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      
      const sId = product.seller.toString();
      const sType = product.sellerType || (product.brand ? 'Admin' : 'Seller');
      
      if (!groupedItems[sId]) {
        groupedItems[sId] = {
          seller: sId,
          sellerType: sType,
          items: [],
          itemsPrice: 0,
          shippingPrice: 0,
          totalPrice: 0
        };
      }
      
      const enrichedItem = {
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product,
        seller: sId,
        sellerType: sType
      };

      groupedItems[sId].items.push(enrichedItem);
      const lineTotal = item.price * item.quantity;
      groupedItems[sId].itemsPrice += lineTotal;
      groupedItems[sId].totalPrice += lineTotal;
    }

    // 3. Create Orders and Deduct Stock
    const createdOrders = [];
    for (const sellerId in groupedItems) {
      const group = groupedItems[sellerId];
      
      const order = new Order({
        orderItems: group.items,
        user: req.user.id,
        seller: group.seller,
        sellerType: group.sellerType,
        shippingAddress,
        paymentMethod,
        itemsPrice: group.itemsPrice,
        shippingPrice: group.shippingPrice,
        totalPrice: group.totalPrice,
        isPaid: true,
        paidAt: Date.now(),
        status: 'Processing',
        businessDetails
      });

      const savedOrder = await order.save();
      createdOrders.push(savedOrder);

      // Deduct stock (Atomic)
      for (const item of group.items) {
        const updatedProduct = await Product.findOneAndUpdate(
          { _id: item.product, countInStock: { $gte: item.quantity } },
          { $inc: { countInStock: -item.quantity } },
          { new: true }
        );

        if (!updatedProduct) {
          throw new Error(`Race condition: Insufficient stock for ${item.name} during checkout.`);
        }

        // Low stock alert
        if (updatedProduct.countInStock <= 5) {
          notifyLowStock(updatedProduct.seller, {
            productId: updatedProduct._id,
            name: updatedProduct.name,
            remainingStock: updatedProduct.countInStock
          });
        }
      }

      // Notify seller
      try {
        const payload = {
          orderId: String(savedOrder._id),
          totalPrice: savedOrder.totalPrice,
          itemsCount: savedOrder.orderItems.reduce((sum, i) => sum + i.quantity, 0),
          status: savedOrder.status,
          createdAt: savedOrder.createdAt,
          customerName: req.user?.fullName,
          shippingCity: savedOrder.shippingAddress?.city
        };

        if (group.sellerType === 'Admin') {
          notifyAdminNewOrder(null, payload);
        } else {
          notifySellerNewOrder(group.seller, payload);
        }
      } catch (e) {
        console.error('Socket notify failed:', e.message);
      }

      // Fire and forget invoice generation (Asynchronous)
      processInvoiceAsync(savedOrder._id, req.user.id);
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({
      success: true,
      data: createdOrders // Return array of orders
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'fullName email')
      .populate('seller', 'fullName shopName email phone shopAddress')
      .populate('deliveryBoy', 'fullName email phone avatar vehicleType vehicleNumber');

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
    const result = await paginate(Order, { user: req.user.id }, req);
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

    const populateOptions = [
      { path: 'user', select: 'fullName email' },
      { 
        path: 'seller', 
        select: 'shopName fullName email',
        transform: (doc, id) => {
          if (!doc && id) return { _id: id, shopName: 'Riddha Mart (Admin)', fullName: 'Riddha Mart' };
          if (doc && !doc.shopName) return { ...doc, shopName: 'Riddha Mart (Official)' };
          return doc;
        }
      },
      { path: 'deliveryBoy', select: 'fullName email phone' }
    ];

    const result = await paginate(Order, query, req, populateOptions);

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
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const newStatus = req.body.status;
      
      // Define valid overall statuses for the Order model
      const validOverallStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
      
      // If the new status is a valid overall status, update it
      if (validOverallStatuses.includes(newStatus)) {
        order.status = newStatus;
      }
      
      // Always handle delivery status tracking
      const deliveryTrackingStatuses = ['Accepted', 'Picked', 'Out for Delivery', 'Delivered', 'Rejected'];
      if (deliveryTrackingStatuses.includes(newStatus)) {
        order.deliveryStatus = newStatus;
        
        // Logical mapping: if picked or out for delivery, overall status is 'Shipped'
        if (newStatus === 'Picked' || newStatus === 'Out for Delivery') {
          order.status = 'Shipped';
        }
      }

      if (newStatus === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.status = 'Delivered';
        order.deliveryStatus = 'Delivered';
      }

      if (newStatus === 'Cancelled') {
        // Restore stock
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { countInStock: item.quantity }
          });
        }
      }

      const updatedOrder = await order.save();
      
      // Notify user about order status update
      notifyUserOrderStatus(order.user, {
        orderId: order._id,
        status: order.status,
        deliveryStatus: order.deliveryStatus,
        message: `Your order #${order._id.toString().slice(-8).toUpperCase()} is now ${order.deliveryStatus || order.status}.`
      });

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
