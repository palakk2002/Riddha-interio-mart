const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Referral = require('../src/models/Referral');
const Notification = require('../src/models/Notification');
const Order = require('../src/models/Order');
const Product = require('../src/models/Product');
const B2BLead = require('../src/models/B2BLead');

function hasIndex(indexes, keyObj, options = {}) {
  return indexes.some(idx => {
    const keyMatch = Object.keys(keyObj).length === Object.keys(idx.key).length &&
      Object.keys(keyObj).every(k => idx.key[k] === keyObj[k]);
    if (!keyMatch) return false;
    
    for (const [optKey, optVal] of Object.entries(options)) {
      if (idx[optKey] !== optVal) return false;
    }
    return true;
  });
}

async function runVerification() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    console.log('--- 📋 Task 1: Index Coverage Verification ---');
    
    const userIndexes = await User.collection.indexes();
    const referralIndexes = await Referral.collection.indexes();
    const notificationIndexes = await Notification.collection.indexes();
    const orderIndexes = await Order.collection.indexes();
    const productIndexes = await Product.collection.indexes();
    const b2bLeadIndexes = await B2BLead.collection.indexes();

    console.log('Verifying User indexes...');
    if (!hasIndex(userIndexes, { referredBy: 1 })) {
      throw new Error('User index on { referredBy: 1 } is missing!');
    }
    console.log('✅ User indexes verified.');

    console.log('Verifying Referral indexes...');
    if (!hasIndex(referralIndexes, { referredUser: 1 })) {
      throw new Error('Referral index on { referredUser: 1 } is missing!');
    }
    console.log('✅ Referral indexes verified.');

    console.log('Verifying Notification indexes & TTL...');
    if (!hasIndex(notificationIndexes, { createdAt: 1 }, { expireAfterSeconds: 2592000 })) {
      throw new Error('Notification TTL index on { createdAt: 1 } with expireAfterSeconds: 2592000 is missing!');
    }
    console.log('✅ Notification TTL index verified.');

    console.log('Verifying Order compound indexes...');
    if (!hasIndex(orderIndexes, { user: 1, createdAt: -1 })) {
      throw new Error('Order index on { user: 1, createdAt: -1 } is missing!');
    }
    if (!hasIndex(orderIndexes, { status: 1, createdAt: -1 })) {
      throw new Error('Order index on { status: 1, createdAt: -1 } is missing!');
    }
    if (!hasIndex(orderIndexes, { paymentStatus: 1, createdAt: -1 })) {
      throw new Error('Order index on { paymentStatus: 1, createdAt: -1 } is missing!');
    }
    console.log('✅ Order indexes verified.');

    console.log('Verifying Product compound indexes...');
    if (!hasIndex(productIndexes, { category: 1, isApproved: 1, isActive: 1 })) {
      throw new Error('Product index on { category: 1, isApproved: 1, isActive: 1 } is missing!');
    }
    if (!hasIndex(productIndexes, { subcategory: 1, isApproved: 1, isActive: 1 })) {
      throw new Error('Product index on { subcategory: 1, isApproved: 1, isActive: 1 } is missing!');
    }
    if (!hasIndex(productIndexes, { brand: 1, isApproved: 1, isActive: 1 })) {
      throw new Error('Product index on { brand: 1, isApproved: 1, isActive: 1 } is missing!');
    }
    if (!hasIndex(productIndexes, { price: 1, isApproved: 1, isActive: 1 })) {
      throw new Error('Product index on { price: 1, isApproved: 1, isActive: 1 } is missing!');
    }
    console.log('✅ Product indexes verified.');

    console.log('Verifying B2BLead indexes...');
    if (!hasIndex(b2bLeadIndexes, { createdAt: -1 })) {
      throw new Error('B2BLead index on { createdAt: -1 } is missing!');
    }
    console.log('✅ B2BLead indexes verified.');
    console.log('✅ Index Coverage Verification Passed!\n');


    console.log('--- 📋 Task 2: $facet Aggregation Integrity ---');
    const facetResult = await Order.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
          ],
          statusCounts: [
            { $group: { _id: "$status", count: { $sum: 1 } } }
          ],
          paymentCounts: [
            { $group: { _id: "$paymentMethod", count: { $sum: 1 } } }
          ]
        }
      }
    ]);

    if (!facetResult || facetResult.length === 0) {
      throw new Error('$facet aggregation returned no result!');
    }
    const metrics = facetResult[0];
    if (!Array.isArray(metrics.totalRevenue) || !Array.isArray(metrics.statusCounts) || !Array.isArray(metrics.paymentCounts)) {
      throw new Error('$facet aggregation result has invalid structure!');
    }
    console.log('   Total Revenue count array length:', metrics.totalRevenue.length);
    console.log('   Status Counts categories found:', metrics.statusCounts.length);
    console.log('   Payment Counts categories found:', metrics.paymentCounts.length);
    console.log('✅ $facet Aggregation Integrity Passed!\n');


    console.log('--- 📋 Task 3: Lean Query Performance Check ---');
    
    console.log('Testing lean query on B2BLead...');
    const b2bLead = await B2BLead.findOne().sort('-createdAt').lean();
    if (b2bLead) {
      const isPlain = !(b2bLead instanceof mongoose.Document) && !b2bLead.$__;
      console.log(`   b2bLead is plain object: ${isPlain}`);
      if (!isPlain) {
        throw new Error('B2BLead query did not return a lean plain object!');
      }
    } else {
      console.log('   No B2BLead records found to test, skipping assertion.');
    }

    console.log('Testing lean query on Product...');
    const productObj = await Product.findOne().select('_id').lean();
    if (productObj) {
      const isPlain = !(productObj instanceof mongoose.Document) && !productObj.$__;
      console.log(`   productObj is plain object: ${isPlain}`);
      if (!isPlain) {
        throw new Error('Product query did not return a lean plain object!');
      }
    } else {
      console.log('   No Product records found to test, skipping assertion.');
    }

    console.log('Testing lean query on Order...');
    const orderObj = await Order.findOne().lean();
    if (orderObj) {
      const isPlain = !(orderObj instanceof mongoose.Document) && !orderObj.$__;
      console.log(`   orderObj is plain object: ${isPlain}`);
      if (!isPlain) {
        throw new Error('Order query did not return a lean plain object!');
      }
    } else {
      console.log('   No Order records found to test, skipping assertion.');
    }
    console.log('✅ Lean Query Performance Check Passed!\n');


    console.log('🌟 ALL DATABASE OPTIMIZATION CHECKS PASSED SUCCESSFULLY!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ DATABASE OPTIMIZATION TEST FAILED WITH ERROR:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

runVerification();
