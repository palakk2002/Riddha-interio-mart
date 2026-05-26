const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Product = require('../src/models/Product');
const Seller = require('../src/models/Seller');
const Admin = require('../src/models/Admin');
const Brand = require('../src/models/Brand');

async function testFetch() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('DB Connected');

    const products = await Product.find({})
      .populate('seller')
      .populate('brand', 'name')
      .lean();
    console.log(`Total Products: ${products.length}`);
    
    products.forEach(p => {
      console.log(`\nProduct: ${p.name}`);
      console.log(`  ID: ${p._id}`);
      console.log(`  Approved: ${p.isApproved}, Active: ${p.isActive}, Status: ${p.approvalStatus}`);
      console.log(`  Price (shown to user): ₹${p.price}`);
      console.log(`  Seller Price: ₹${p.sellerPrice}`);
      console.log(`  Discount Price: ₹${p.discountPrice}`);
      console.log(`  Seller Type: ${p.sellerType}`);
      if (p.seller) {
        console.log(`  Seller Name: ${p.seller.fullName}`);
        console.log(`  Seller Shop: ${p.seller.shopName}`);
        console.log(`  Seller Verified: ${p.seller.isVerified}`);
      } else {
        console.log(`  Seller: NULL`);
      }
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testFetch();
