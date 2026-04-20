const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../src/models/Product');

async function testFetch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected');

    const products = await Product.find({}).populate('seller', 'fullName shopName');
    console.log(`Total Products: ${products.length}`);
    
    products.forEach(p => {
      console.log(`[${p.sellerType}] ${p.name} - Approved: ${p.isApproved}, Active: ${p.isActive}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testFetch();
