const mongoose = require('mongoose');
require('dotenv').config();

const checkOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const Order = require('./src/models/Order');
    const orders = await Order.find({}).limit(5).sort('-createdAt');
    console.log('--- RECENT ORDERS ---');
    orders.forEach(o => {
      console.log(`ID: ${o._id} | Seller: ${o.seller} | Type: ${o.sellerType} | Status: ${o.status}`);
    });
    console.log('--- END ---');
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
};

checkOrders();
