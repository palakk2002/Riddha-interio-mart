const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
require('../src/config/cloudinary');

// Models
const Product = require('../src/models/Product');
const Seller = require('../src/models/Seller');
const User = require('../src/models/User');
const Coupon = require('../src/models/Coupon');
const Campaign = require('../src/models/Campaign');
const Order = require('../src/models/Order');
const Cart = require('../src/models/Cart');
const Brand = require('../src/models/Brand');

// Controllers
const { addOrderItems } = require('../src/controllers/orderController');
const { createCoupon: createCouponCtrl, createCampaign: createCampaignCtrl, getMarketingAnalytics } = require('../src/controllers/marketingController');

async function runTests() {
  console.log('=== SELLER MARKETING INTEGRATION TEST RUNNER ===');
  await connectDB();

  let testUser = null;
  let testSeller = null;
  let testProduct = null;
  let createdCouponId = null;
  let createdCampaignId = null;
  let createdOrderId = null;

  try {
    // 1. Setup/Verify test models
    console.log('\n[Step 1] Setting up dummy User, Seller and Product records...');
    
    testUser = await User.findOne({ email: 'testbuyer@example.com' });
    if (!testUser) {
      testUser = await User.create({
        fullName: 'Test Buyer',
        email: 'testbuyer@example.com',
        password: 'password123',
        phone: '9999999999'
      });
      console.log('Created test User.');
    } else {
      console.log('Found existing test User.');
    }

    testSeller = await Seller.findOne({ email: 'testseller@example.com' });
    if (!testSeller) {
      testSeller = await Seller.create({
        fullName: 'Test Seller',
        email: 'testseller@example.com',
        password: 'password123',
        phone: '8888888888',
        shopName: 'Test Decor Shop',
        shopAddress: '123, Decor Lane, Delhi',
        isApproved: true,
        approvalStatus: 'Approved'
      });
      console.log('Created test Seller.');
    } else {
      console.log('Found existing test Seller.');
    }

    let testBrand = await Brand.findOne({ name: '[Marketing Test] Brand' });
    if (!testBrand) {
      testBrand = await Brand.create({
        name: '[Marketing Test] Brand',
        image: 'dummy.jpg',
        isActive: true
      });
      console.log('Created test Brand.');
    }

    // Always create a fresh product to ensure stock availability
    testProduct = await Product.create({
      name: 'Test Terracotta Vase',
      description: 'Elegant handmade terracotta vase.',
      price: 200,
      countInStock: 50,
      seller: testSeller._id,
      sellerType: 'Seller',
      category: 'Flooring',
      subcategory: 'Terracotta Tiles',
      brand: testBrand._id,
      images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80'],
      isApproved: true,
      approvalStatus: 'approved',
      sku: 'TEST-MAR-001',
      hsnCode: '6802'
    });
    console.log(`Created test Product: "${testProduct.name}"`);

    // Ensure we do not have an existing coupon code of the same name
    await Coupon.deleteMany({ code: 'GROWTH50' });

    // 2. Test Coupon Controller Creation
    console.log('\n[Step 2] Testing Coupon Creation via Marketing Controller...');
    const coupReq = {
      body: {
        code: 'GROWTH50',
        discountType: 'flat',
        discountValue: 50,
        minPurchaseAmount: 100,
        usageLimit: 10,
        expiryDate: new Date(Date.now() + 86400000).toISOString() // 1 day expiry
      },
      user: {
        id: testSeller._id.toString(),
        role: 'seller'
      }
    };
    const coupRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await createCouponCtrl(coupReq, coupRes);
    if (coupRes.statusCode !== 201 || !coupRes.body.success) {
      throw new Error(`Coupon creation failed: ${JSON.stringify(coupRes.body)}`);
    }
    createdCouponId = coupRes.body.data._id;
    console.log(`Coupon GROWTH50 created successfully. ID: ${createdCouponId}`);

    // 3. Test multi-seller checkout coupon validation
    console.log('\n[Step 3] Testing Secure Coupon Checkout Validation inside Transaction...');
    const checkoutReq = {
      body: {
        orderItems: [
          {
            product: testProduct._id.toString(),
            quantity: 2
          }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          mobileNumber: '9999999999',
          pincode: '400002', // Mumbai (COD supported and not restricted)
          city: 'Mumbai',
          state: 'Maharashtra',
          fullAddress: 'Flat 402, Nariman Point'
        },
        paymentMethod: 'COD',
        couponCode: 'GROWTH50'
      },
      user: {
        id: testUser._id.toString(),
        fullName: 'Test Buyer'
      }
    };
    const checkoutRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await addOrderItems(checkoutReq, checkoutRes);
    if (checkoutRes.statusCode !== 201 || !checkoutRes.body.success) {
      throw new Error(`Secure Checkout failed: ${JSON.stringify(checkoutRes.body)}`);
    }

    const createdOrder = checkoutRes.body.data[0];
    createdOrderId = createdOrder._id;
    console.log(`Order created successfully with ID: ${createdOrderId}`);

    // Assert prices: subtotal = 200 * 2 = 400. Discount flat: 50. Final order itemsPrice = 400 - 50 = 350.
    // Shipping price should be 50 because sellingTotal = 350 < 500. TotalPrice = 350 + 50 = 400.
    console.log(`Subtotal: ${createdOrder.pricingBreakdown.subtotal}`);
    console.log(`Discount Amount (including coupon): ${createdOrder.discountAmount}`);
    console.log(`Shipping Price: ${createdOrder.shippingPrice}`);
    console.log(`Total Price: ${createdOrder.totalPrice}`);

    if (createdOrder.pricingBreakdown.subtotal !== 400) {
      throw new Error(`Expected subtotal 400, got ${createdOrder.pricingBreakdown.subtotal}`);
    }
    if (createdOrder.discountAmount !== 50) {
      throw new Error(`Expected discountAmount 50, got ${createdOrder.discountAmount}`);
    }
    if (createdOrder.totalPrice !== 400) {
      throw new Error(`Expected totalPrice 400, got ${createdOrder.totalPrice}`);
    }

    console.log('✓ Checkout Price Deductions and Rescale verified successfully.');

    // Assert Coupon usedCount incremented
    const updatedCoupon = await Coupon.findById(createdCouponId);
    console.log(`Coupon redemption usedCount: ${updatedCoupon.usedCount}`);
    if (updatedCoupon.usedCount !== 1) {
      throw new Error(`Expected coupon usedCount to be 1, got ${updatedCoupon.usedCount}`);
    }
    console.log('✓ Coupon atomic usedCount increment verified successfully.');

    // 4. Test Campaign Controller Creation
    console.log('\n[Step 4] Testing Campaign Launch via Marketing Controller...');
    const campReq = {
      body: {
        title: 'Terracotta Festive Boost',
        type: 'Flash Sale',
        discountPercentage: 25,
        products: [testProduct._id.toString()],
        budget: 1500,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days duration
      },
      user: {
        id: testSeller._id.toString(),
        role: 'seller'
      }
    };
    const campRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await createCampaignCtrl(campReq, campRes);
    if (campRes.statusCode !== 201 || !campRes.body.success) {
      throw new Error(`Campaign launch failed: ${JSON.stringify(campRes.body)}`);
    }
    createdCampaignId = campRes.body.data._id;
    console.log(`Campaign launched successfully. ID: ${createdCampaignId}`);

    // 5. Test Live ROI / CAC Analytics
    console.log('\n[Step 5] Testing Aggregated Marketing Analytics...');
    const analReq = {
      user: {
        id: testSeller._id.toString(),
        role: 'seller'
      }
    };
    const analRes = {
      statusCode: 200,
      status: function(code) { this.statusCode = code; return this; },
      json: function(data) { this.body = data; return this; }
    };

    await getMarketingAnalytics(analReq, analRes);
    if (analRes.statusCode !== 200 || !analRes.body.success) {
      throw new Error(`Aggregated analytics failed: ${JSON.stringify(analRes.body)}`);
    }

    console.log('Aggregated Analytics Response:', JSON.stringify(analRes.body.data, null, 2));
    console.log('✓ Live CAC/ROI calculations verified successfully.');

    console.log('\n===========================================');
    console.log('ALL growth center integration tests PASSED.');
    console.log('===========================================');

  } catch (err) {
    console.error('\n❌ INTEGRATION TEST FAILED:', err.message);
  } finally {
    // Clean up test mutations
    console.log('\nCleaning up test mutations in database...');
    if (createdOrderId) {
      await Order.deleteOne({ _id: createdOrderId });
      console.log(`Deleted test Order ${createdOrderId}`);
    }
    if (createdCouponId) {
      await Coupon.deleteOne({ _id: createdCouponId });
      console.log(`Deleted test Coupon ${createdCouponId}`);
    }
    if (createdCampaignId) {
      await Campaign.deleteOne({ _id: createdCampaignId });
      console.log(`Deleted test Campaign ${createdCampaignId}`);
    }
    if (testProduct) {
      await Product.deleteOne({ _id: testProduct._id });
      console.log(`Deleted test Product ${testProduct._id}`);
    }
    
    // Clean up test brand
    await Brand.deleteOne({ name: '[Marketing Test] Brand' });
    console.log('Deleted test Brand.');

    // Close Mongoose connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

runTests();
