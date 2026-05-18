const Order = require('../models/Order');
const mongoose = require('mongoose');

// @desc    Get delivery dashboard analytics
// @route   GET /api/delivery/analytics
// @access  Private (Delivery)
exports.getDeliveryAnalytics = async (req, res, next) => {
  try {
    const deliveryId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Dashboard Stats & Performance
    const statsAgg = await Order.aggregate([
      { $match: { deliveryBoy: deliveryId } },
      {
        $group: {
          _id: '$deliveryStatus',
          count: { $sum: 1 },
          orders: { $push: '$$ROOT' } // We keep track of orders for time calculation
        }
      }
    ]);

    let totalAssigned = 0;
    let completedDeliveries = 0;
    let pendingDeliveries = 0;
    let rejectedDeliveries = 0;
    
    let totalDeliveryTimeMs = 0;
    let completedWithTimeCount = 0;

    statsAgg.forEach(stat => {
      totalAssigned += stat.count;
      if (stat._id === 'Delivered') {
        completedDeliveries += stat.count;
        
        // Calculate average time
        stat.orders.forEach(order => {
          if (order.deliveredAt && order.deliveryAssignmentTime) {
            totalDeliveryTimeMs += (new Date(order.deliveredAt) - new Date(order.deliveryAssignmentTime));
            completedWithTimeCount++;
          }
        });
      } else if (stat._id === 'Rejected') {
        rejectedDeliveries += stat.count;
      } else if (['Pending', 'Accepted', 'Picked', 'Out for Delivery'].includes(stat._id)) {
        pendingDeliveries += stat.count;
      }
    });

    const successRate = totalAssigned > 0 ? ((completedDeliveries / totalAssigned) * 100).toFixed(1) : 0;
    
    // Convert ms to hours
    const avgDeliveryTimeMs = completedWithTimeCount > 0 ? (totalDeliveryTimeMs / completedWithTimeCount) : 0;
    const avgDeliveryTimeHours = avgDeliveryTimeMs > 0 ? (avgDeliveryTimeMs / (1000 * 60 * 60)).toFixed(1) : 0;

    // 2. Earnings & COD
    // Calculate Commission (max of shippingPrice or 50) and COD collections
    const earningsAgg = await Order.aggregate([
      { $match: { deliveryBoy: deliveryId, deliveryStatus: 'Delivered' } },
      {
        $group: {
          _id: null,
          totalCommission: {
            $sum: {
              $cond: [
                { $gte: ['$shippingPrice', 50] },
                '$shippingPrice',
                50
              ]
            }
          },
          codToDeposit: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$paymentMethod', 'COD'] }, { $eq: ['$isCashDeposited', false] }] },
                '$totalPrice',
                0
              ]
            }
          }
        }
      }
    ]);

    const totalEarnings = earningsAgg.length > 0 ? earningsAgg[0].totalCommission : 0;
    const codToDeposit = earningsAgg.length > 0 ? earningsAgg[0].codToDeposit : 0;

    // 3. Delivery History (Recent 5)
    const recentDeliveries = await Order.find({ deliveryBoy: deliveryId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id shippingAddress deliveryStatus createdAt');

    const formattedHistory = recentDeliveries.map(order => ({
      id: order._id.toString().slice(-8).toUpperCase(),
      customerName: order.shippingAddress.fullName,
      status: order.deliveryStatus,
      dateTime: order.createdAt
    }));

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalAssigned,
          completedDeliveries,
          pendingDeliveries,
          rejectedDeliveries
        },
        earnings: {
          totalEarnings,
          codToDeposit
        },
        performance: {
          successRate: parseFloat(successRate),
          avgDeliveryTimeHours: parseFloat(avgDeliveryTimeHours)
        },
        recentDeliveries: formattedHistory
      }
    });

  } catch (error) {
    console.error('Delivery Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving delivery analytics' });
  }
};
