const mongoose = require('mongoose');
const Delivery = require('./src/models/Delivery');
require('dotenv').config();

async function checkDeliveries() {
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await Delivery.countDocuments();
  const deliveries = await Delivery.find().select('fullName email approvalStatus');
  console.log('Total Deliveries:', count);
  console.log('Deliveries:', deliveries);
  process.exit();
}

checkDeliveries();
