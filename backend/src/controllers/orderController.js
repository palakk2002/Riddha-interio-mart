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
const pricingService = require('../services/pricingService');

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

  // 1. COD Eligibility Validation (Fast, read-only pre-checks before transaction)
  if (paymentMethod === 'COD') {
    try {
      const eligibility = await getCodEligibility(orderItems, shippingAddress ? shippingAddress.pincode : null);
      if (!eligibility.eligible) {
        return res.status(400).json({ success: false, message: eligibility.reason });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  const mongoose = require('mongoose');
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Reserve Stock atomically inside the Mongoose session
    const inventoryService = require('../services/inventoryService');
    const reservationsList = [];

    try {
      for (const item of orderItems) {
        // Reserve stock hold for 15 minutes inside the session
        const reservation = await inventoryService.reserveStock(
          req.user.id,
          item.product,
          item.quantity,
          15,
          session
        );
        reservationsList.push(reservation);
      }
    } catch (reserveError) {
      throw new Error(`Checkout failed: ${reserveError.message}`);
    }

    // 3. Secure backend calculation of all items
    const checkoutPricing = await pricingService.calculateCartPricing(orderItems);

    // 4. Group items by Seller
    const groupedItems = {};
    for (const item of checkoutPricing.enrichedItems) {
      const sId = item.seller.toString();
      const sType = item.sellerType || 'Seller';
      
      if (!groupedItems[sId]) {
        groupedItems[sId] = {
          seller: sId,
          sellerType: sType,
          items: []
        };
      }
      
      groupedItems[sId].items.push(item);
    }

    // 5. Create Orders and Commit Stock Reservations
    const createdOrders = [];
    const lowStockAlerts = [];

    for (const sellerId in groupedItems) {
      const group = groupedItems[sellerId];
      
      // Calculate exact pricing details for this seller order group
      const groupPricing = await pricingService.calculateCartPricing(
        group.items.map(i => ({ product: i.product, quantity: i.quantity }))
      );

      // Perform secure inter-state vs intra-state tax breakdown
      const taxService = require('../services/taxService');
      const taxCalculation = await taxService.calculateTaxes(groupPricing.enrichedItems, shippingAddress);
      
      const isCod = paymentMethod === 'COD';
      
      const order = new Order({
        orderItems: group.items,
        user: req.user.id,
        seller: group.seller,
        sellerType: group.sellerType,
        shippingAddress,
        paymentMethod,
        itemsPrice: Number((groupPricing.subtotal - groupPricing.discountAmount).toFixed(2)),
        shippingPrice: groupPricing.shippingPrice,
        taxAmount: taxCalculation.totalTax,
        cgst: taxCalculation.cgst,
        sgst: taxCalculation.sgst,
        igst: taxCalculation.igst,
        taxType: taxCalculation.items[0] ? taxCalculation.items[0].taxType : 'intra-state',
        discountAmount: groupPricing.discountAmount,
        pricingBreakdown: {
          subtotal: groupPricing.subtotal,
          taxAmount: taxCalculation.totalTax,
          cgst: taxCalculation.cgst,
          sgst: taxCalculation.sgst,
          igst: taxCalculation.igst,
          shippingPrice: groupPricing.shippingPrice,
          discountAmount: groupPricing.discountAmount,
          totalPrice: groupPricing.totalPrice
        },
        totalPrice: groupPricing.totalPrice,
        isPaid: !isCod,
        paidAt: isCod ? undefined : Date.now(),
        paymentStatus: isCod ? 'pending' : 'paid',
        status: isCod ? 'Pending' : 'Processing',
        businessDetails
      });

      // Save order inside database transaction session
      const savedOrder = await order.save({ session });
      createdOrders.push(savedOrder);

      // Commit reservations (Atomic and Concurrency-Safe inside session)
      for (const item of group.items) {
        const matchedRes = reservationsList.find(res => res.product.toString() === item.product.toString());
        if (!matchedRes) {
          throw new Error(`Active stock hold reservation not found for ${item.name}`);
        }

        await inventoryService.commitReservation(matchedRes._id, session);

        // Fetch updated product for low stock alerts check
        const updatedProduct = await Product.findById(item.product).session(session);
        if (updatedProduct && updatedProduct.countInStock <= 5) {
          lowStockAlerts.push({
            seller: updatedProduct.seller,
            data: {
              productId: updatedProduct._id,
              name: updatedProduct.name,
              remainingStock: updatedProduct.countInStock
            }
          });
        }
      }
    }

    // 6. Clear user cart inside transaction
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] }, { session });

    // Commit transaction atomically
    await session.commitTransaction();
    session.endSession();

    // 7. Post-Commit Actions (Low stock alerts, invoice processing, socket notifications)
    for (const alert of lowStockAlerts) {
      notifyLowStock(alert.seller, alert.data);
    }

    for (const savedOrder of createdOrders) {
      // Create Tax Audit Log for taxation system records
      try {
        const taxService = require('../services/taxService');
        const taxCalculation = {
          totalTax: savedOrder.taxAmount,
          cgst: savedOrder.cgst,
          sgst: savedOrder.sgst,
          igst: savedOrder.igst,
          taxableAmount: Number((savedOrder.totalPrice - savedOrder.taxAmount).toFixed(2)),
          items: savedOrder.orderItems.map(item => {
            const isIntraState = savedOrder.taxType === 'intra-state';
            const gstFactor = 1 + ((item.gstRate || 18) / 100);
            const lineTax = (item.price * item.quantity) - ((item.price * item.quantity) / gstFactor);
            return {
              product: item.product,
              name: item.name,
              gstRate: item.gstRate || 18,
              taxAmount: Number(lineTax.toFixed(2)),
              cgst: isIntraState ? Number((lineTax / 2).toFixed(2)) : 0,
              sgst: isIntraState ? Number((lineTax / 2).toFixed(2)) : 0,
              igst: isIntraState ? 0 : Number(lineTax.toFixed(2)),
              sellerState: isIntraState ? (savedOrder.shippingAddress.state || 'Delhi') : 'Gujarat',
              shippingState: savedOrder.shippingAddress.state || 'Delhi',
              taxType: savedOrder.taxType
            };
          })
        };
        await taxService.createAuditLog(savedOrder, req.user.id, savedOrder.seller, taxCalculation, 'sale');
      } catch (logErr) {
        console.error('Audit logging error:', logErr.message);
      }

      // Fire notifications
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

        const group = groupedItems[savedOrder.seller.toString()];
        if (group && group.sellerType === 'Admin') {
          notifyAdminNewOrder(null, payload);
        } else {
          notifySellerNewOrder(savedOrder.seller, payload);
        }
      } catch (e) {
        console.error('Socket notify failed:', e.message);
      }

      // Credit pending earnings to Seller Wallet
      try {
        const walletService = require('../services/walletService');
        await walletService.recordPendingSale(savedOrder);
      } catch (walletErr) {
        console.error('Failed to log pending earnings:', walletErr.message);
      }

      // Fire and forget invoice generation (Asynchronous)
      processInvoiceAsync(savedOrder._id, req.user.id);

      // Queue Order Confirmation Email
      try {
        const User = require('../models/User');
        const customer = await User.findById(req.user.id);
        if (customer && customer.email) {
          const emailService = require('../services/emailService');
          await emailService.queueEmail(customer.email, `Order Confirmation - #${savedOrder._id.toString().slice(-8).toUpperCase()}`, 'order_confirmation', { order: savedOrder });
        }
      } catch (emailErr) {
        console.error('Failed to queue order confirmation email:', emailErr.message);
      }
    }

    // Process Referral First Order reward for referrer
    try {
      const referralService = require('../services/referralService');
      await referralService.processFirstOrderReward(req.user.id, createdOrders[0]._id);
    } catch (refOrderRewardErr) {
      console.error('Referral order reward processing failed:', refOrderRewardErr.message);
    }

    res.status(201).json({
      success: true,
      data: createdOrders
    });

  } catch (error) {
    // Abort transaction and roll back all mutations safely
    await session.abortTransaction();
    session.endSession();
    console.error('Order creation transaction aborted:', error.message);

    const isNotFound = error.message.includes('Product not found');
    res.status(isNotFound ? 404 : 400).json({
      success: false,
      message: error.message
    });
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
      
      // Early exit if status is identical to avoid double-processing
      if (order.status === newStatus) {
        return res.status(200).json({ success: true, data: order });
      }

      // 1. Guard against modifications to already Cancelled orders
      if (order.status === 'Cancelled') {
        return res.status(400).json({ success: false, error: 'Cancelled orders cannot be modified.' });
      }

      // 2. Guard against invalid transitions on Delivered orders
      if (order.status === 'Delivered' && newStatus === 'Cancelled') {
        return res.status(400).json({ success: false, error: 'Delivered orders cannot be cancelled.' });
      }
      
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
        
        // COD Payment Cash Collection transition
        if (order.paymentMethod === 'COD') {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentStatus = 'paid';
        }
      }

      if (newStatus === 'Cancelled') {
        // Restore stock atomically
        const inventoryService = require('../services/inventoryService');
        for (const item of order.orderItems) {
          await inventoryService.returnStock(item.product, item.quantity);
        }
      }

      const updatedOrder = await order.save();

      // Clear pending seller escrow earnings and credit delivery partner wallet
      if (newStatus === 'Delivered') {
        try {
          const walletService = require('../services/walletService');
          await walletService.clearPendingSale(updatedOrder._id);
          
          if (updatedOrder.deliveryBoy) {
            await walletService.recordDeliveryEarning(
              updatedOrder.deliveryBoy,
              updatedOrder._id,
              updatedOrder.paymentMethod === 'COD',
              updatedOrder.totalPrice
            );
          }
        } catch (walletErr) {
          console.error('Failed to update wallets upon delivery:', walletErr.message);
        }
      }
      
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

const RESTRICTED_COD_PINCODES = ['110001', '400001', '700001'];

const getCodEligibility = async (orderItems, pincode) => {
  // 1. Check pincode restriction
  if (pincode && RESTRICTED_COD_PINCODES.includes(pincode.trim())) {
    return {
      eligible: false,
      reason: `Cash On Delivery (COD) is not available for pincode ${pincode}.`
    };
  }

  // 2. Check product restriction
  if (orderItems && orderItems.length > 0) {
    for (const item of orderItems) {
      const productId = item.product || item._id || item.id;
      const product = await Product.findById(productId);
      if (!product) {
        return {
          eligible: false,
          reason: `Product not found: ${item.name || 'Unknown Item'}.`
        };
      }
      if (product.isCodAllowed === false) {
        return {
          eligible: false,
          reason: `The product "${product.name}" is restricted from Cash On Delivery (COD) payments.`
        };
      }
    }
  }

  return { eligible: true };
};

// @desc    Check Cash On Delivery (COD) eligibility
// @route   POST /api/orders/cod-eligibility
// @access  Private
exports.checkCodEligibility = async (req, res) => {
  const { orderItems, pincode } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items provided' });
  }
  if (!pincode) {
    return res.status(400).json({ success: false, message: 'Shipping pincode is required' });
  }

  try {
    const eligibility = await getCodEligibility(orderItems, pincode);
    return res.status(200).json({
      success: true,
      eligible: eligibility.eligible,
      reason: eligibility.reason || ''
    });
  } catch (error) {
    console.error('COD eligibility check error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Calculate complete pricing breakdown for a cart
// @route   POST /api/orders/calculate-pricing
// @access  Private
exports.calculateOrderPricing = async (req, res, next) => {
  const { orderItems } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No cart items provided for pricing calculation' });
  }

  try {
    const pricing = await pricingService.calculateCartPricing(orderItems);
    return res.status(200).json({
      success: true,
      data: pricing
    });
  } catch (error) {
    console.error('Pricing calculation error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCodEligibility = getCodEligibility;

