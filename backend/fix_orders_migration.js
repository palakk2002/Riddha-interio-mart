const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load models
const Order = require('./src/models/Order');
const connectDB = require('./src/config/db');

dotenv.config({ path: './.env' });

const fixOrders = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB via utility');

    // Find orders missing sellerType or seller
    const orders = await Order.find({ 
      $or: [
        { sellerType: { $exists: false } },
        { seller: { $exists: false } }
      ]
    });

    console.log(`Found ${orders.length} orders to fix`);

    for (const order of orders) {
      if (!order.sellerType) {
        // Look at first item for seller type
        const firstItem = order.orderItems && order.orderItems[0];
        order.sellerType = firstItem?.sellerType || 'Admin'; 
      }

      if (!order.seller) {
         // Try to recover seller from items
         const firstItem = order.orderItems && order.orderItems[0];
         order.seller = firstItem?.seller;
      }
      
      // If still no seller, use a dummy or delete? 
      // Better to find an Admin to assign it to if it's truly orphaned
      if (!order.seller) {
         console.warn(`Skipping order ${order._id} - total orphan (no items or sellers)`);
         continue;
      }

      // Fix orderItems as well
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          if (!item.sellerType) item.sellerType = 'Admin';
          if (!item.seller) item.seller = order.seller;
        });
      }

      try {
        await order.save();
        console.log(`Fixed order: ${order._id}`);
      } catch (saveErr) {
        console.error(`Failed to save order ${order._id}:`, saveErr.message);
      }
    }

    console.log('Migration complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
};

fixOrders();
