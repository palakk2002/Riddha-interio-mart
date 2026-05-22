const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

// Models
const User = require('../src/models/User');
const Delivery = require('../src/models/Delivery');
const Order = require('../src/models/Order');

// Controllers
const {
  getOrders,
  updateOrderStatus,
  respondToDeliveryAssignment,
  verifyDeliveryOtp,
  resendDeliveryOtp
} = require('../src/controllers/orderController');

async function runTests() {
  console.log('=== DELIVERY ORDERS SECTION SECURITY & INTEGRATION TEST RUNNER ===');
  await connectDB();

  let testCustomer = null;
  let testDeliveryPartner1 = null;
  let testDeliveryPartner2 = null;
  let orderA = null;
  let orderB = null;
  let orderC = null;
  let orderD = null;

  try {
    // 1. Setup test records
    console.log('\n[Step 1] Setting up dummy test entities...');
    
    testCustomer = await User.findOne({ email: 'customer_delivery_test@example.com' });
    if (!testCustomer) {
      testCustomer = await User.create({
        fullName: 'Test Customer',
        email: 'customer_delivery_test@example.com',
        password: 'password123',
        phone: '9876543210',
        isVerified: true
      });
      console.log('Created test Customer.');
    }

    testDeliveryPartner1 = await Delivery.findOne({ email: 'delivery_partner_1@example.com' });
    if (!testDeliveryPartner1) {
      testDeliveryPartner1 = await Delivery.create({
        fullName: 'Delivery Partner One',
        email: 'delivery_partner_1@example.com',
        password: 'password123',
        phone: '9999911111',
        servicePincodes: ['400088', '400089'],
        approvalStatus: 'Approved',
        status: 'Available'
      });
      console.log('Created test Delivery Partner 1 (Service Pincodes: 400088, 400089).');
    } else {
      testDeliveryPartner1.servicePincodes = ['400088', '400089'];
      testDeliveryPartner1.approvalStatus = 'Approved';
      testDeliveryPartner1.status = 'Available';
      await testDeliveryPartner1.save();
    }

    testDeliveryPartner2 = await Delivery.findOne({ email: 'delivery_partner_2@example.com' });
    if (!testDeliveryPartner2) {
      testDeliveryPartner2 = await Delivery.create({
        fullName: 'Delivery Partner Two',
        email: 'delivery_partner_2@example.com',
        password: 'password123',
        phone: '9999922222',
        servicePincodes: ['500001'],
        approvalStatus: 'Approved',
        status: 'Available'
      });
      console.log('Created test Delivery Partner 2 (Service Pincodes: 500001).');
    } else {
      testDeliveryPartner2.servicePincodes = ['500001'];
      testDeliveryPartner2.approvalStatus = 'Approved';
      testDeliveryPartner2.status = 'Available';
      await testDeliveryPartner2.save();
    }

    // Clean up older orders for these test users
    await Order.deleteMany({ user: testCustomer._id });

    // Seed test orders
    console.log('\n[Step 2] Seeding test orders with specific geo-locations and states...');

    // Order A: Assigned to Partner 1, Shipped/Accepted
    orderA = await Order.create({
      user: testCustomer._id,
      seller: new mongoose.Types.ObjectId(), // Dummy Seller
      sellerType: 'Seller',
      orderItems: [{
        name: 'Eco Sofa Cushion',
        quantity: 2,
        image: 'sofa.png',
        price: 450,
        product: new mongoose.Types.ObjectId(),
        seller: new mongoose.Types.ObjectId()
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        mobileNumber: '9876543210',
        pincode: '400088',
        city: 'Mumbai',
        fullAddress: 'Flat 101, A Wing, Cozy Apartments'
      },
      paymentMethod: 'Online',
      itemsPrice: 900,
      totalPrice: 900,
      isPaid: true,
      status: 'Shipped',
      deliveryBoy: testDeliveryPartner1._id,
      deliveryStatus: 'Accepted'
    });

    // Order B: Out for Delivery with known OTP
    orderB = await Order.create({
      user: testCustomer._id,
      seller: new mongoose.Types.ObjectId(),
      sellerType: 'Seller',
      orderItems: [{
        name: 'Bohemian Teak Chair',
        quantity: 1,
        image: 'chair.png',
        price: 1250,
        product: new mongoose.Types.ObjectId(),
        seller: new mongoose.Types.ObjectId()
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        mobileNumber: '9876543210',
        pincode: '400088',
        city: 'Mumbai',
        fullAddress: 'Flat 101, A Wing, Cozy Apartments'
      },
      paymentMethod: 'COD',
      itemsPrice: 1250,
      totalPrice: 1250,
      isPaid: false,
      status: 'Shipped',
      deliveryBoy: testDeliveryPartner1._id,
      deliveryStatus: 'Out for Delivery',
      deliveryOtp: '9999'
    });

    // Order C: Unassigned/Available in Partner 1's Pincode (400088)
    orderC = await Order.create({
      user: testCustomer._id,
      seller: new mongoose.Types.ObjectId(),
      sellerType: 'Seller',
      orderItems: [{
        name: 'Minimalist Dining Mat',
        quantity: 4,
        image: 'mat.png',
        price: 100,
        product: new mongoose.Types.ObjectId(),
        seller: new mongoose.Types.ObjectId()
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        mobileNumber: '9876543210',
        pincode: '400088',
        city: 'Mumbai',
        fullAddress: 'Flat 101, A Wing, Cozy Apartments'
      },
      paymentMethod: 'COD',
      itemsPrice: 400,
      totalPrice: 400,
      isPaid: false,
      status: 'Processing',
      deliveryStatus: 'None'
    });

    // Order D: Unassigned/Available in Partner 2's Pincode (500001)
    orderD = await Order.create({
      user: testCustomer._id,
      seller: new mongoose.Types.ObjectId(),
      sellerType: 'Seller',
      orderItems: [{
        name: 'Modern Ceiling Lamp',
        quantity: 1,
        image: 'lamp.png',
        price: 800,
        product: new mongoose.Types.ObjectId(),
        seller: new mongoose.Types.ObjectId()
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        mobileNumber: '9876543210',
        pincode: '500001',
        city: 'Hyderabad',
        fullAddress: 'Apt 4B, Skyview Towers'
      },
      paymentMethod: 'Online',
      itemsPrice: 800,
      totalPrice: 800,
      isPaid: true,
      status: 'Processing',
      deliveryStatus: 'None'
    });

    console.log('Orders successfully seeded.');

    // 3. Test Security Transition Protection (Direct status transitions bypass verification)
    console.log('\n[Step 3] Testing Security Transition Guards...');
    
    // Attempting to bypass OTP by updating status directly to 'Delivered'
    const bypassDeliveredReq = {
      params: { id: orderA._id },
      body: { status: 'Delivered' },
      user: {
        id: testDeliveryPartner1._id.toString(),
        role: 'delivery'
      }
    };
    const bypassDeliveredRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await updateOrderStatus(bypassDeliveredReq, bypassDeliveredRes);
    
    if (bypassDeliveredRes.statusCode === 403 && bypassDeliveredRes.body.error.includes('Security Guard')) {
      console.log('✅ PASS: Direct transition to "Delivered" successfully blocked by Security Guard.');
    } else {
      throw new Error(`Expected 403 Forbidden with Security Guard error message, got status ${bypassDeliveredRes.statusCode} and body: ${JSON.stringify(bypassDeliveredRes.body)}`);
    }

    // Attempting to bypass OTP by updating status directly to 'Cancelled'
    const bypassCancelledReq = {
      params: { id: orderA._id },
      body: { status: 'Cancelled' },
      user: {
        id: testDeliveryPartner1._id.toString(),
        role: 'delivery'
      }
    };
    const bypassCancelledRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await updateOrderStatus(bypassCancelledReq, bypassCancelledRes);

    if (bypassCancelledRes.statusCode === 403 && bypassCancelledRes.body.error.includes('Security Guard')) {
      console.log('✅ PASS: Direct transition to "Cancelled" successfully blocked by Security Guard.');
    } else {
      throw new Error(`Expected 403 Forbidden with Security Guard error message, got status ${bypassCancelledRes.statusCode} and body: ${JSON.stringify(bypassCancelledRes.body)}`);
    }

    // Permitted state changes: Picked and Out for Delivery should succeed
    const permittedTransitionReq = {
      params: { id: orderA._id },
      body: { status: 'Picked' },
      user: {
        id: testDeliveryPartner1._id.toString(),
        role: 'delivery'
      }
    };
    const permittedTransitionRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await updateOrderStatus(permittedTransitionReq, permittedTransitionRes);
    if (permittedTransitionRes.statusCode === 200 && permittedTransitionRes.body.success) {
      console.log('✅ PASS: Permitted status transition to "Picked" successfully processed.');
    } else {
      throw new Error(`Expected 200 Success for permitted state change, got status ${permittedTransitionRes.statusCode}: ${JSON.stringify(permittedTransitionRes.body)}`);
    }

    // 4. Test Geographic Scoping
    console.log('\n[Step 4] Testing Geographic Pincode Scoping in Available Pool...');
    
    const getOrdersReq = {
      query: {},
      user: {
        id: testDeliveryPartner1._id.toString(),
        role: 'delivery',
        servicePincodes: testDeliveryPartner1.servicePincodes
      }
    };
    const getOrdersRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await getOrders(getOrdersReq, getOrdersRes);
    
    if (getOrdersRes.statusCode !== 200) {
      throw new Error(`Failed to query available orders: ${JSON.stringify(getOrdersRes.body)}`);
    }

    const returnedOrders = getOrdersRes.body.data || [];
    const isOrderCInPool = returnedOrders.some(o => o._id.toString() === orderC._id.toString());
    const isOrderDInPool = returnedOrders.some(o => o._id.toString() === orderD._id.toString());

    if (isOrderCInPool && !isOrderDInPool) {
      console.log('✅ PASS: Pincode scoping works perfectly. Order C (matching pincode 400088) is visible, Order D (mismatching pincode 500001) is filtered out.');
    } else {
      throw new Error(`Pincode scoping mismatch! Order C in pool? ${isOrderCInPool} | Order D in pool? ${isOrderDInPool}`);
    }

    // 5. Test assignment rejection response and temporary blacklist filter
    console.log('\n[Step 5] Testing Rejection Blacklist isolation...');

    // Partner 1 rejects Order A
    const rejectReq = {
      params: { id: orderA._id },
      body: { status: 'Rejected' },
      user: {
        id: testDeliveryPartner1._id.toString(),
        fullName: testDeliveryPartner1.fullName,
        role: 'delivery'
      }
    };
    const rejectRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await respondToDeliveryAssignment(rejectReq, rejectRes);
    if (rejectRes.statusCode !== 200 || !rejectRes.body.success) {
      throw new Error(`Failed to reject assignment: ${JSON.stringify(rejectRes.body)}`);
    }

    // Check database to ensure deliveryBoy is cleared and rejectedBy has the record
    const updatedOrderA = await Order.findById(orderA._id);
    if (updatedOrderA.deliveryBoy === undefined && updatedOrderA.rejectedBy.length === 1 && updatedOrderA.rejectedBy[0].deliveryBoy.toString() === testDeliveryPartner1._id.toString()) {
      console.log('✅ PASS: Assignment cleared and partner registered in rejectedBy blacklist.');
    } else {
      throw new Error(`Order database status check failed after decline: ${JSON.stringify(updatedOrderA)}`);
    }

    // Query available pool again for Partner 1 and verify Order A (which is now Rejected/Unassigned in 400088) is NOT shown
    const reGetOrdersRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };
    await getOrders(getOrdersReq, reGetOrdersRes);
    
    const rePool = reGetOrdersRes.body.data || [];
    const isOrderAInPool = rePool.some(o => o._id.toString() === orderA._id.toString());
    if (!isOrderAInPool) {
      console.log('✅ PASS: Rejection Blacklist verified. Declined Order A is successfully hidden from available pool queries.');
    } else {
      throw new Error(`Blacklist failure! Rejected Order A still popped up in available pool.`);
    }

    // 6. Test OTP verification and environment bypass gating
    console.log('\n[Step 6] Testing OTP Verification and Env Bypass Gating...');

    // Case A: useMockOtpForDelivery is FALSE. Static '1234' must fail.
    process.env.useMockOtpForDelivery = 'false';
    process.env.USE_MOCK_OTP_FOR_DELIVERY = 'false';

    const failBypassReq = {
      params: { id: orderB._id },
      body: { otp: '1234' },
      user: {
        id: testDeliveryPartner1._id.toString(),
        fullName: testDeliveryPartner1.fullName,
        role: 'delivery'
      }
    };
    const failBypassRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await verifyDeliveryOtp(failBypassReq, failBypassRes);
    if (failBypassRes.statusCode === 400 && !failBypassRes.body.success) {
      console.log('✅ PASS: Static OTP "1234" bypass successfully BLOCKED when environment toggle is false.');
    } else {
      throw new Error(`Expected 400 Invalid OTP, got status ${failBypassRes.statusCode}: ${JSON.stringify(failBypassRes.body)}`);
    }

    // Case B: useMockOtpForDelivery is TRUE. Static '1234' must succeed.
    process.env.useMockOtpForDelivery = 'true';
    
    const successBypassRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await verifyDeliveryOtp(failBypassReq, successBypassRes);
    if (successBypassRes.statusCode === 200 && successBypassRes.body.success) {
      console.log('✅ PASS: Static OTP "1234" bypass successfully ALLOWED when environment toggle is true.');
    } else {
      throw new Error(`Expected 200 Success, got status ${successBypassRes.statusCode}: ${JSON.stringify(successBypassRes.body)}`);
    }

    // Reset orderB status back to Out for Delivery to test legitimate verification
    orderB.status = 'Shipped';
    orderB.deliveryStatus = 'Out for Delivery';
    orderB.isDelivered = false;
    orderB.deliveryOtp = '8888';
    await orderB.save();

    // Case C: Legitimate verification with correct random OTP
    const legitReq = {
      params: { id: orderB._id },
      body: { otp: '8888' },
      user: {
        id: testDeliveryPartner1._id.toString(),
        fullName: testDeliveryPartner1.fullName,
        role: 'delivery'
      }
    };
    const legitRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await verifyDeliveryOtp(legitReq, legitRes);
    if (legitRes.statusCode === 200 && legitRes.body.success) {
      console.log('✅ PASS: Legitimate customer OTP verified successfully. Order marked delivered.');
    } else {
      throw new Error(`Legitimate OTP verification failed: ${JSON.stringify(legitRes.body)}`);
    }

    // 7. Test Resend OTP Workflow
    console.log('\n[Step 7] Testing Resend OTP generation and assignment validation...');
    
    // Setup Order C as assigned to Partner 1 and marked Out for Delivery
    orderC.deliveryBoy = testDeliveryPartner1._id;
    orderC.status = 'Shipped';
    orderC.deliveryStatus = 'Out for Delivery';
    orderC.deliveryOtp = '1111';
    await orderC.save();

    const resendReq = {
      params: { id: orderC._id },
      user: {
        id: testDeliveryPartner1._id.toString(),
        fullName: testDeliveryPartner1.fullName,
        role: 'delivery'
      }
    };
    const resendRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await resendDeliveryOtp(resendReq, resendRes);
    
    if (resendRes.statusCode === 200 && resendRes.body.success) {
      console.log('✅ PASS: Resend OTP generates and registers a fresh random OTP successfully.');
      const updatedOrderC = await Order.findById(orderC._id);
      if (updatedOrderC.deliveryOtp === '1111') {
        throw new Error(`Expected OTP to be regenerated, but it remained "1111".`);
      }
      console.log(`✅ PASS: Confirmed OTP changed from "1111" to new dynamic code: "${updatedOrderC.deliveryOtp}"`);
    } else {
      throw new Error(`Resend OTP controller execution failed: ${JSON.stringify(resendRes.body)}`);
    }

    console.log('\n=== ALL DELIVERY ORDERS MODULE SECURITY & INTEGRATION TESTS PASSED SUCCESSFULLY! ===\n');

  } catch (error) {
    console.error('\n❌ SECURITY INTEGRATION TEST FAILED:', error.message);
    console.error(error);
    process.exit(1);
  } finally {
    // Clean up test order records from DB
    if (testCustomer) {
      await Order.deleteMany({ user: testCustomer._id });
      console.log('Cleaned up seeded test orders.');
    }
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

runTests();
