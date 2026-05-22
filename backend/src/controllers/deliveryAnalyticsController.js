const Order = require('../models/Order');
const DeliveryWallet = require('../models/DeliveryWallet');
const mongoose = require('mongoose');

// @desc    Get delivery dashboard analytics
// @route   GET /api/delivery/analytics
// @access  Private (Delivery)
exports.getDeliveryAnalytics = async (req, res, next) => {
  try {
    const deliveryId = new mongoose.Types.ObjectId(req.user.id);

    // 1. Optimized Dashboard Stats & Performance
    // Aggregating directly inside MongoDB to protect RAM and avoid BSON size breaches
    const statsAgg = await Order.aggregate([
      { $match: { deliveryBoy: deliveryId } },
      {
        $group: {
          _id: '$deliveryStatus',
          count: { $sum: 1 },
          completedWithTimeCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$deliveryStatus', 'Delivered'] },
                    { $ifNull: ['$deliveredAt', false] },
                    { $ifNull: ['$deliveryAssignmentTime', false] },
                    { $gt: ['$deliveredAt', '$deliveryAssignmentTime'] }
                  ]
                },
                1,
                0
              ]
            }
          },
          totalDeliveryTimeMs: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$deliveryStatus', 'Delivered'] },
                    { $ifNull: ['$deliveredAt', false] },
                    { $ifNull: ['$deliveryAssignmentTime', false] },
                    { $gt: ['$deliveredAt', '$deliveryAssignmentTime'] }
                  ]
                },
                { $subtract: ['$deliveredAt', '$deliveryAssignmentTime'] },
                0
              ]
            }
          }
        }
      }
    ]);

    let completedDeliveries = 0;
    let pendingDeliveries = 0;
    let pickupRequestsCount = 0;
    let totalTimeMs = 0;
    let timeCount = 0;

    statsAgg.forEach(stat => {
      if (stat._id === 'Delivered') {
        completedDeliveries += stat.count;
        totalTimeMs += stat.totalDeliveryTimeMs;
        timeCount += stat.completedWithTimeCount;
      } else if (['Pending', 'Accepted', 'Picked', 'Out for Delivery'].includes(stat._id)) {
        pendingDeliveries += stat.count;
        if (stat._id === 'Accepted') {
          pickupRequestsCount += stat.count;
        }
      }
    });

    // Fix Rejection Analytics: Count orders rejected by this driver
    const rejectedDeliveries = await Order.countDocuments({
      'rejectedBy.deliveryBoy': deliveryId
    });

    const totalAssigned = completedDeliveries + pendingDeliveries + rejectedDeliveries;
    const successRate = totalAssigned > 0 ? ((completedDeliveries / totalAssigned) * 100).toFixed(1) : 0;
    const avgDeliveryTimeMs = timeCount > 0 ? (totalTimeMs / timeCount) : 0;
    const avgDeliveryTimeHours = avgDeliveryTimeMs > 0 ? (avgDeliveryTimeMs / (1000 * 60 * 60)).toFixed(1) : 0;

    // 2. Earnings & COD - Bound directly to DeliveryWallet database records
    let wallet = await DeliveryWallet.findOne({ deliveryPartner: deliveryId });
    if (!wallet) {
      wallet = await DeliveryWallet.create({ deliveryPartner: deliveryId });
    }
    const totalEarnings = wallet.earningsBalance;
    const codToDeposit = wallet.codCollectionLiability;

    // 3. Dynamic Historical 7-Day Performance & Earnings Telemetry
    const performanceData = [];
    const revenueData = [];
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const ordersLast7Days = await Order.find({
      deliveryBoy: deliveryId,
      createdAt: { $gte: sevenDaysAgo }
    }).select('deliveryStatus createdAt totalPrice');

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayName = daysOfWeek[d.getDay()];
      const dateString = d.toDateString();

      const dayOrders = ordersLast7Days.filter(o => new Date(o.createdAt).toDateString() === dateString);
      const completed = dayOrders.filter(o => o.deliveryStatus === 'Delivered').length;

      // Count rejections on this specific day matching this delivery boy
      const startOfDay = new Date(d);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);

      const rejected = await Order.countDocuments({
        rejectedBy: {
          $elemMatch: {
            deliveryBoy: deliveryId,
            rejectedAt: { $gte: startOfDay, $lte: endOfDay }
          }
        }
      });

      performanceData.push({
        name: dayName,
        completed,
        rejected
      });

      // Bind daily earnings directly to the wallet ledger transactions of type 'delivery_fee_credit'
      const dayEarningsTransactions = wallet.transactions.filter(t => 
        t.type === 'delivery_fee_credit' && 
        new Date(t.createdAt).toDateString() === dateString
      );
      const dayEarnings = dayEarningsTransactions.reduce((sum, t) => sum + t.amount, 0);

      const timeLabel = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      revenueData.push({
        name: timeLabel,
        value: dayEarnings
      });
    }

    // 4. Delivery History (Recent 5)
    const recentDeliveries = await Order.find({ deliveryBoy: deliveryId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('_id shippingAddress deliveryStatus createdAt');

    const formattedHistory = recentDeliveries.map(order => ({
      id: order._id.toString().slice(-8).toUpperCase(),
      customerName: order.shippingAddress?.fullName || 'Guest Customer',
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
          rejectedDeliveries,
          pickupRequestsCount
        },
        earnings: {
          totalEarnings,
          codToDeposit
        },
        performance: {
          successRate: parseFloat(successRate),
          avgDeliveryTimeHours: parseFloat(avgDeliveryTimeHours)
        },
        charts: {
          performanceData,
          revenueData
        },
        recentDeliveries: formattedHistory
      }
    });

  } catch (error) {
    console.error('Delivery Analytics Error:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving delivery analytics' });
  }
};
