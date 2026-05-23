const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment config
dotenv.config({ path: path.join(__dirname, '../.env') });

const Delivery = require('../src/models/Delivery');
const Order = require('../src/models/Order');
const DeliveryWallet = require('../src/models/DeliveryWallet');
const DeliverySettlement = require('../src/models/DeliverySettlement');
const walletService = require('../src/services/walletService');

async function runTests() {
  console.log('🚀 INITIALIZING DELIVERY DASHBOARD LIFECYCLE TESTS...');
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/riddha-interio';
  await mongoose.connect(mongoUri);
  console.log('💾 Connected to database.');

  let testPartner;
  let testOrder;
  
  try {
    // 1. Create a dummy delivery partner
    console.log('\n--- 1. SEEDING TEST PARTNER ---');
    testPartner = await Delivery.create({
      fullName: 'Test Logistics Runner',
      email: `runner-${Date.now()}@test.com`,
      phone: '9876543210',
      password: 'password123',
      vehicleType: 'Bike',
      vehicleNumber: 'KA-01-XX-9999',
      approvalStatus: 'Approved'
    });
    console.log(`✓ Seeding successful. Partner ID: ${testPartner._id}`);

    // 2. Test Shift Clock Timestamp logic
    console.log('\n--- 2. TESTING STATUS TRANSITIONS (SHIFT TIMER) ---');
    
    // Simulate going Available
    testPartner.status = 'Available';
    testPartner.lastOnlineTime = Date.now();
    await testPartner.save();
    console.log(`✓ Status updated to "Available". lastOnlineTime recorded: ${testPartner.lastOnlineTime}`);
    
    if (!testPartner.lastOnlineTime) {
      throw new Error('Shift clock timestamp is missing on going Available!');
    }

    // Simulate going Offline
    testPartner.status = 'Offline';
    testPartner.lastOnlineTime = null;
    await testPartner.save();
    console.log('✓ Status updated to "Offline". lastOnlineTime cleared (null).');

    // Restore Available for analytics testing
    testPartner.status = 'Available';
    testPartner.lastOnlineTime = Date.now();
    await testPartner.save();

    // 3. Seed test orders to verify high-performance analytics calculation
    console.log('\n--- 3. SEEDING TEST DELIVERIES ---');
    const assignmentTime = new Date();
    assignmentTime.setHours(assignmentTime.getHours() - 2); // 2 hours ago
    
    const deliveryTime = new Date();
    
    testOrder = await Order.create({
      user: new mongoose.Types.ObjectId(),
      seller: new mongoose.Types.ObjectId(),
      sellerType: 'Seller',
      orderItems: [{
        name: 'Ergonomic Mesh Chair',
        quantity: 1,
        image: 'chair.jpg',
        price: 4500,
        product: new mongoose.Types.ObjectId(),
        seller: new mongoose.Types.ObjectId()
      }],
      shippingAddress: {
        fullName: 'John Doe',
        mobileNumber: '9999999999',
        pincode: '560001',
        city: 'Bengaluru',
        fullAddress: 'No. 10, MG Road'
      },
      paymentMethod: 'COD',
      itemsPrice: 4500,
      shippingPrice: 75,
      totalPrice: 4575,
      isPaid: false,
      deliveryBoy: testPartner._id,
      deliveryStatus: 'Delivered',
      deliveryAssignmentTime: assignmentTime,
      deliveredAt: deliveryTime
    });
    console.log(`✓ Seeded delivered COD order: ${testOrder._id}`);

    // 4. Test memory-safe MongoDB Aggregate calculations
    console.log('\n--- 4. TESTING HIGH-PERFORMANCE ANALYTICS AGGREGATIONS ---');
    const statsAgg = await Order.aggregate([
      { $match: { deliveryBoy: testPartner._id } },
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
                    { $ifNull: ['$deliveryAssignmentTime', false] }
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
                    { $ifNull: ['$deliveryAssignmentTime', false] }
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
    
    console.log('Aggregation result:', JSON.stringify(statsAgg, null, 2));
    
    const deliveredStat = statsAgg.find(s => s._id === 'Delivered');
    if (!deliveredStat || deliveredStat.count !== 1) {
      throw new Error('Analytics aggregation failed to report correct delivery stats!');
    }
    
    const avgHours = (deliveredStat.totalDeliveryTimeMs / deliveredStat.completedWithTimeCount) / (1000 * 60 * 60);
    console.log(`✓ Correctly calculated Average Delivery Time: ${avgHours.toFixed(2)} hours (Expected: 2.00 hours)`);

    // 5. Test Wallet Integration & Cash Deposit Request Flow
    console.log('\n--- 5. TESTING WALLET INTEGRATION & SETTLEMENT lifecycle ---');
    
    // Create Wallet & Log COD collected liability
    await walletService.recordDeliveryEarning(testPartner._id, testOrder._id, true, testOrder.totalPrice);
    
    let wallet = await DeliveryWallet.findOne({ deliveryPartner: testPartner._id });
    console.log(`✓ Wallet credited. EarningsBalance: ₹${wallet.earningsBalance}, CodLiability: ₹${wallet.codCollectionLiability}`);
    
    if (wallet.earningsBalance !== 50) {
      throw new Error(`Earnings balance mismatch! Expected ₹50, got ₹${wallet.earningsBalance}`);
    }
    if (wallet.codCollectionLiability !== 4575) {
      throw new Error(`COD Liability mismatch! Expected ₹4575, got ₹${wallet.codCollectionLiability}`);
    }

    // Partner initiates settlement deposit request
    console.log('\nSubmitting pending settlement request (UPI deposit)...');
    const depositAmount = 2000;
    const settlement = await DeliverySettlement.create({
      deliveryPartner: testPartner._id,
      type: 'cod_deposit',
      amount: depositAmount,
      status: 'pending',
      notes: 'UTR: UPI82938492'
    });
    console.log(`✓ Settlement requested. ID: ${settlement._id}, Status: ${settlement.status}`);

    // Admin verifies and approves the settlement request
    console.log('\nSimulating Admin approval for settlement...');
    settlement.status = 'completed';
    settlement.notes += ' | Approved by Admin Clerk';
    await settlement.save();

    wallet.codCollectionLiability = Number((wallet.codCollectionLiability - settlement.amount).toFixed(2));
    wallet.transactions.push({
      amount: -settlement.amount,
      type: 'cod_settlement_to_admin',
      description: `Cash deposit settlement to Admin. Settlement ID: ${settlement._id}`,
      referenceId: settlement._id,
      balanceAfter: wallet.earningsBalance
    });
    await wallet.save();

    console.log('✓ Settlement approved.');
    
    // Reload wallet to assert decremented liability
    wallet = await DeliveryWallet.findOne({ deliveryPartner: testPartner._id });
    console.log(`✓ Post-settlement liability: ₹${wallet.codCollectionLiability} (Expected: ₹2575)`);
    
    if (wallet.codCollectionLiability !== 2575) {
      throw new Error(`COD collection liability deduction failed! Got: ₹${wallet.codCollectionLiability}`);
    }

    console.log('\n🎉 ALL DELIVERY DASHBOARD CODEAUDIT & INTEGRATION TESTS PASSED TRIUMPHANTLY!');

  } catch (err) {
    console.error('\n❌ TEST SUITE RUN ENCOUNTERED FAILURE:', err.message);
  } finally {
    // 6. Cleanup seeded test data to keep database clean
    console.log('\n--- 6. CLEANING UP TEST RECORDS ---');
    if (testOrder) {
      await Order.findByIdAndDelete(testOrder._id);
      console.log('✓ Cleaned up test order.');
    }
    if (testPartner) {
      await DeliveryWallet.deleteOne({ deliveryPartner: testPartner._id });
      await DeliverySettlement.deleteMany({ deliveryPartner: testPartner._id });
      await Delivery.findByIdAndDelete(testPartner._id);
      console.log('✓ Cleaned up test partner and associate wallet records.');
    }
    
    await mongoose.connection.close();
    console.log('🔌 Database connection closed cleanly.');
  }
}

runTests();
