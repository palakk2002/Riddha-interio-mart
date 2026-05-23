const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const Product = require('../models/Product');
const DispatchEvent = require('../models/DispatchEvent');
const { getIO } = require('../socket');

// Helper to calculate total order weight
const calculateOrderWeight = async (order) => {
  let totalWeight = 0;
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    const itemWeight = product && product.weight !== undefined ? product.weight : 1.5;
    totalWeight += itemWeight * item.quantity;
  }
  return totalWeight;
};

// Helper to determine allowed vehicle types based on total weight
const getEligibleVehicles = (weight) => {
  if (weight < 5) {
    // Light: any vehicle
    return ['Bike', 'Van', 'Truck', 'Bicycle', 'Motorcycle', 'Scooter', 'Car'];
  } else if (weight <= 20) {
    // Medium: motorized vehicles
    return ['Bike', 'Van', 'Truck', 'Motorcycle', 'Scooter', 'Car'];
  } else {
    // Heavy: strictly four-wheelers
    return ['Van', 'Truck', 'Car'];
  }
};

// Core Auto-Allocation and Broadcast Engine
exports.broadcastNewOrder = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if (!order) return console.error(`[Dispatch Engine] Order ${orderId} not found.`);

    // If order already has a deliveryBoy, do not dispatch
    if (order.deliveryBoy) return;

    const orderWeight = await calculateOrderWeight(order);
    const eligibleVehicles = getEligibleVehicles(orderWeight);
    const pincode = order.shippingAddress?.pincode;

    if (!pincode) {
      console.warn(`[Dispatch Engine] Order ${orderId} is missing shipping pincode.`);
      return;
    }

    // Find online, clocked-in, under-capacity riders in the service pincode zone
    const riders = await Delivery.find({
      status: 'Available',
      'activeShift.isClockedIn': true,
      servicePincodes: pincode,
      vehicleType: { $in: eligibleVehicles }
    });

    // Filter riders who have rejected this order in the last 24 hours
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const rejections = order.rejectedBy || [];
    
    const activeRejections = rejections
      .filter(r => new Date(r.rejectedAt) >= twentyFourHoursAgo)
      .map(r => r.deliveryBoy?.toString());

    const availableRiders = riders.filter(rider => {
      const riderIdStr = rider._id.toString();
      
      // 1. Check rejection blacklist
      if (activeRejections.includes(riderIdStr)) return false;

      // 2. Check volumetric limits (maxVolumeCapacity)
      const volumeLimit = rider.vehicleDetails?.maxVolumeCapacity || 4;
      if ((rider.activeShift?.currentPayloadCount || 0) >= volumeLimit) return false;

      // 3. Check carrying weight capacity (maxWeightCapacity)
      const weightLimit = rider.vehicleDetails?.maxWeightCapacity || 20;
      const currentWeight = rider.activeShift?.currentPayloadWeight || 0;
      if (currentWeight + orderWeight > weightLimit) return false;

      return true;
    });

    if (availableRiders.length === 0) {
      console.log(`[Dispatch Engine] No available eligible riders for Order #${order._id.toString().slice(-8).toUpperCase()}`);
      return;
    }

    // Sort riders by lowest current load count to distribute orders fairly
    availableRiders.sort((a, b) => (a.activeShift?.currentPayloadCount || 0) - (b.activeShift?.currentPayloadCount || 0));
    const selectedRider = availableRiders[0];

    const offeredAt = new Date();
    const expiresAt = new Date(offeredAt.getTime() + 60 * 1000); // 60s window

    // Create Offered Dispatch Event
    const event = await DispatchEvent.create({
      order: orderId,
      deliveryBoy: selectedRider._id,
      expiresAt
    });

    console.log(`[Dispatch Engine] Offering Order #${order._id.toString().slice(-8).toUpperCase()} to Partner "${selectedRider.fullName}" (Expires in 60s)`);

    // Emit live Socket.io alert to the courier's room
    let io;
    try {
      io = getIO();
    } catch (e) {
      console.warn('[Dispatch Engine] Socket.io not initialized, skipping socket broadcast.');
    }

    if (io) {
      io.to(`delivery:${selectedRider._id}`).emit('dispatch:offer', {
        eventId: event._id,
        orderId: order._id,
        orderNumber: order._id.toString().slice(-8).toUpperCase(),
        shopName: order.businessDetails?.shopName || 'Operations Hub',
        deliveryAddress: `${order.shippingAddress.fullAddress}, ${order.shippingAddress.city}`,
        totalBill: order.totalPrice,
        weight: orderWeight,
        expiresInSeconds: 60
      });
    }

    // Set auto-expiration timeout (60 seconds)
    setTimeout(async () => {
      try {
        // If database connection is closed (e.g. during test cleanup), exit silently
        if (DispatchEvent.db && DispatchEvent.db.readyState !== 1) return;

        const freshEvent = await DispatchEvent.findById(event._id);
        if (freshEvent && freshEvent.broadcastStatus === 'Offered') {
          freshEvent.broadcastStatus = 'Expired';
          await freshEvent.save();
          console.log(`[Dispatch Engine] Offer ${event._id} expired for Partner "${selectedRider.fullName}". Re-allocating order...`);

          // Update rider status to Offline/Busy if they missed an assignment to keep pool clean
          // Or just leave them Available and trigger reallocation
          await exports.broadcastNewOrder(orderId);
        }
      } catch (err) {
        console.error('[Dispatch Engine] Auto-expiration error:', err.message);
      }
    }, 60 * 1000);

  } catch (err) {
    console.error('[Dispatch Engine] Allocation error:', err.message);
  }
};

// @desc    Clock-In Duty Shift
// @route   PUT /api/dispatch/clock-in
// @access  Private/Delivery
exports.clockInShift = async (req, res, next) => {
  try {
    const partner = await Delivery.findById(req.user.id);
    if (!partner) return res.status(404).json({ success: false, error: 'Partner not found' });

    partner.activeShift = {
      isClockedIn: true,
      clockedInAt: new Date(),
      currentPayloadWeight: 0,
      currentPayloadCount: 0
    };
    partner.status = 'Available';
    partner.lastOnlineTime = new Date();

    await partner.save();
    res.status(200).json({ success: true, message: 'Clocked-in to shift successfully.', data: partner });
  } catch (err) {
    next(err);
  }
};

// @desc    Clock-Out Duty Shift
// @route   PUT /api/dispatch/clock-out
// @access  Private/Delivery
exports.clockOutShift = async (req, res, next) => {
  try {
    const partner = await Delivery.findById(req.user.id);
    if (!partner) return res.status(404).json({ success: false, error: 'Partner not found' });

    partner.activeShift = {
      isClockedIn: false,
      clockedInAt: null,
      currentPayloadWeight: 0,
      currentPayloadCount: 0
    };
    partner.status = 'Offline';
    partner.lastOnlineTime = null;

    await partner.save();
    res.status(200).json({ success: true, message: 'Clocked-out of shift successfully.', data: partner });
  } catch (err) {
    next(err);
  }
};

// @desc    Get Active Offered Dispatches
// @route   GET /api/dispatch/offers
// @access  Private/Delivery
exports.getLiveOffers = async (req, res, next) => {
  try {
    const now = new Date();
    const offers = await DispatchEvent.find({
      deliveryBoy: req.user.id,
      broadcastStatus: 'Offered',
      expiresAt: { $gt: now }
    }).populate('order');

    res.status(200).json({ success: true, data: offers });
  } catch (err) {
    next(err);
  }
};

// @desc    Accept Dispatch Offer
// @route   POST /api/dispatch/offers/:eventId/accept
// @access  Private/Delivery
exports.acceptOffer = async (req, res, next) => {
  try {
    const event = await DispatchEvent.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, error: 'Offer not found' });

    if (event.deliveryBoy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized to accept this offer' });
    }

    if (event.broadcastStatus !== 'Offered') {
      return res.status(400).json({ success: false, error: `Offer is already ${event.broadcastStatus.toLowerCase()}` });
    }

    if (event.expiresAt < new Date()) {
      event.broadcastStatus = 'Expired';
      await event.save();
      // Re-trigger allocation
      exports.broadcastNewOrder(event.order);
      return res.status(400).json({ success: false, error: 'Offer has expired' });
    }

    const order = await Order.findById(event.order);
    if (!order) return res.status(404).json({ success: false, error: 'Order associated with this offer not found' });

    // Race protection: Check if order already has an assigned driver
    if (order.deliveryBoy && order.deliveryBoy.toString() !== req.user.id) {
      event.broadcastStatus = 'Expired';
      await event.save();
      return res.status(409).json({ success: false, error: 'This order has already been assigned to another partner' });
    }

    // Atomic Event Accept
    event.broadcastStatus = 'Accepted';
    await event.save();

    // Assign to courier
    order.deliveryBoy = req.user.id;
    order.deliveryStatus = 'Accepted';
    order.status = 'Processing';
    await order.save();

    // Update Partner payload statistics
    const partner = await Delivery.findById(req.user.id);
    const orderWeight = await calculateOrderWeight(order);

    partner.activeShift.currentPayloadCount = (partner.activeShift.currentPayloadCount || 0) + 1;
    partner.activeShift.currentPayloadWeight = (partner.activeShift.currentPayloadWeight || 0) + orderWeight;
    await partner.save();

    res.status(200).json({ 
      success: true, 
      message: 'Offer accepted successfully! Order is added to your active deliveries.',
      data: order 
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reject Dispatch Offer
// @route   POST /api/dispatch/offers/:eventId/reject
// @access  Private/Delivery
exports.rejectOffer = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    const event = await DispatchEvent.findById(req.params.eventId);
    if (!event) return res.status(404).json({ success: false, error: 'Offer not found' });

    if (event.deliveryBoy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized to reject this offer' });
    }

    if (event.broadcastStatus !== 'Offered') {
      return res.status(400).json({ success: false, error: `Offer is already ${event.broadcastStatus.toLowerCase()}` });
    }

    // Atomic Event Reject
    event.broadcastStatus = 'Rejected';
    event.rejectionReason = rejectionReason || 'Partner declined';
    await event.save();

    // Push into order's rejection blacklist
    const order = await Order.findById(event.order);
    if (order) {
      if (!order.rejectedBy) order.rejectedBy = [];
      order.rejectedBy.push({
        deliveryBoy: req.user.id,
        rejectedAt: new Date()
      });
      // Ensure delivery status resets if it was offered
      order.deliveryStatus = 'None';
      await order.save();

      // Trigger auto-allocation search query for the NEXT best eligible rider
      exports.broadcastNewOrder(order._id);
    }

    res.status(200).json({ success: true, message: 'Offer declined. Order has been returned to the dispatch queue.' });
  } catch (err) {
    next(err);
  }
};
