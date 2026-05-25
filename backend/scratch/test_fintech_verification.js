const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Seller = require('../src/models/Seller');
const Order = require('../src/models/Order');
const Return = require('../src/models/Return');
const Wallet = require('../src/models/Wallet');
const Delivery = require('../src/models/Delivery');
const DeliveryWallet = require('../src/models/DeliveryWallet');
const SellerWallet = require('../src/models/SellerWallet');
const Referral = require('../src/models/Referral');
const DeliverySettlement = require('../src/models/DeliverySettlement');
const Product = require('../src/models/Product');

const walletService = require('../src/services/walletService');
const referralService = require('../src/services/referralService');
const { updateReturnStatus } = require('../src/controllers/returnController');
const { confirmCashDeposit } = require('../src/controllers/adminController');

async function runFintechVerification() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!\n');

    // Setup: Create dummy entities
    console.log('--- 📋 Setting up Dummy Records ---');
    
    // 1. Customer User
    let testCustomer = await User.findOne({ email: 'test_customer@fintech.com' });
    if (!testCustomer) {
      testCustomer = await User.create({
        fullName: 'Test Customer',
        email: 'test_customer@fintech.com',
        password: 'password123',
        isEmailVerified: true
      });
    }
    console.log(`Test Customer: ${testCustomer._id}`);

    // 2. Referrer User
    let testReferrer = await User.findOne({ email: 'test_referrer@fintech.com' });
    if (!testReferrer) {
      testReferrer = await User.create({
        fullName: 'Test Referrer',
        email: 'test_referrer@fintech.com',
        password: 'password123',
        isEmailVerified: true
      });
    }
    console.log(`Test Referrer: ${testReferrer._id}`);

    // 3. Seller
    let testSeller = await Seller.findOne({ email: 'test_seller@fintech.com' });
    if (!testSeller) {
      testSeller = await Seller.create({
        fullName: 'Test Seller',
        email: 'test_seller@fintech.com',
        shopName: 'Test Seller Shop',
        password: 'password123',
        bankDetails: {
          accountHolderName: 'Test Seller',
          accountNumber: '987654321012',
          ifscCode: 'ICIC0009876',
          bankName: 'ICICI Bank'
        }
      });
    }
    console.log(`Test Seller: ${testSeller._id}`);

    // 4. Delivery Partner
    let testDelivery = await Delivery.findOne({ email: 'test_delivery@fintech.com' });
    if (!testDelivery) {
      testDelivery = await Delivery.create({
        fullName: 'Test Delivery Driver',
        email: 'test_delivery@fintech.com',
        phone: '9999988888',
        password: 'password123',
        vehicleType: 'Bike',
        approvalStatus: 'Approved'
      });
    }
    console.log(`Test Delivery: ${testDelivery._id}`);

    // 5. Dummy Brand
    const Brand = require('../src/models/Brand');
    let testBrand = await Brand.findOne({ name: 'Fintech Test Brand' });
    if (!testBrand) {
      testBrand = await Brand.create({
        name: 'Fintech Test Brand'
      });
    }
    console.log(`Test Brand: ${testBrand._id}`);

    // 6. Dummy Product
    let testProduct = await Product.findOne({ name: 'Fintech Test Table' });
    if (!testProduct) {
      testProduct = await Product.create({
        name: 'Fintech Test Table',
        description: 'Luxury testing table',
        price: 1500,
        category: 'Test Category',
        seller: testSeller._id,
        sellerType: 'Seller',
        brand: testBrand._id,
        countInStock: 50,
        images: ['https://example.com/image.png']
      });
    }
    console.log(`Test Product: ${testProduct._id}\n`);

    // Clean previous wallets/ledgers
    await Wallet.deleteMany({ user: { $in: [testCustomer._id, testReferrer._id] } });
    await DeliveryWallet.deleteOne({ deliveryPartner: testDelivery._id });
    await SellerWallet.deleteOne({ seller: testSeller._id });
    await Referral.deleteMany({ referredUser: testCustomer._id });
    await Order.deleteMany({ user: testCustomer._id });
    await Return.deleteMany({ user: testCustomer._id });
    await DeliverySettlement.deleteMany({ deliveryPartner: testDelivery._id });

    // ==========================================
    // VERIFICATION 1: Wallet Idempotency Constraints
    // ==========================================
    console.log('--- 🛡️ VERIFICATION 1: Wallet Idempotency Constraints ---');
    const creditKey = `credit_test_${Date.now()}`;
    
    console.log('1. Dispatching parallel credits to Customer Wallet with same idempotencyKey...');
    const creditPromise1 = walletService.creditUserWallet(testCustomer._id, 1000, 'signup_bonus', 'Idempotent Credit', null, creditKey);
    const creditPromise2 = walletService.creditUserWallet(testCustomer._id, 1000, 'signup_bonus', 'Idempotent Credit', null, creditKey);
    
    await Promise.all([creditPromise1, creditPromise2]);
    
    let custWallet = await Wallet.findOne({ user: testCustomer._id });
    console.log(`   Customer Wallet Balance after credits: ₹${custWallet.balance} (Expected: ₹1000)`);
    console.log(`   Transaction count: ${custWallet.transactions.length} (Expected: 1)`);
    
    if (custWallet.balance !== 1000 || custWallet.transactions.length !== 1) {
      throw new Error('Verification 1 (Credit Idempotency) Failed!');
    }

    console.log('2. Dispatching parallel debits with same idempotencyKey...');
    const debitKey = `debit_test_${Date.now()}`;
    const debitPromise1 = walletService.debitUserWallet(testCustomer._id, 400, 'purchase_debit', 'Idempotent Debit', null, debitKey);
    const debitPromise2 = walletService.debitUserWallet(testCustomer._id, 400, 'purchase_debit', 'Idempotent Debit', null, debitKey);
    
    try {
      await Promise.all([debitPromise1, debitPromise2]);
    } catch (e) {
      console.log(`   Blocked debit duplicate: "${e.message}"`);
    }

    custWallet = await Wallet.findOne({ user: testCustomer._id });
    console.log(`   Customer Wallet Balance after debits: ₹${custWallet.balance} (Expected: ₹600)`);
    console.log(`   Transaction count: ${custWallet.transactions.length} (Expected: 2)`);

    if (custWallet.balance !== 600 || custWallet.transactions.length !== 2) {
      throw new Error('Verification 1 (Debit Idempotency) Failed!');
    }
    console.log('✅ VERIFICATION 1 PASSED!\n');

    // ==========================================
    // VERIFICATION 2: Refund Sync & Crediting Check
    // ==========================================
    console.log('--- 🔄 VERIFICATION 2: Refund Sync & Wallet Return Crediting ---');
    
    // Create Delivered order
    const orderItemId = new mongoose.Types.ObjectId();
    const testOrder = await Order.create({
      user: testCustomer._id,
      seller: testSeller._id,
      sellerType: 'Seller',
      orderItems: [{
        _id: orderItemId,
        product: testProduct._id,
        name: testProduct.name,
        image: 'https://example.com/image.png',
        quantity: 1,
        price: 1500,
        seller: testSeller._id,
        sellerType: 'Seller',
        returnStatus: 'None'
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        mobileNumber: '9999988888',
        pincode: '302001',
        city: 'Jaipur',
        fullAddress: '123 Test Street'
      },
      itemsPrice: 1500,
      shippingPrice: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalPrice: 1500,
      paymentMethod: 'Prepaid',
      isPaid: true,
      isDelivered: true,
      status: 'Delivered',
      deliveryStatus: 'Delivered'
    });

    const testReturn = await Return.create({
      order: testOrder._id,
      orderItem: orderItemId,
      product: testProduct._id,
      user: testCustomer._id,
      seller: testSeller._id,
      reason: 'Defective or Damaged',
      description: 'The product does not work at all.',
      refundAmount: 1500,
      status: 'Pending'
    });

    // Mock Express Request & Response for Return Status Update
    const mockReq = {
      params: { id: testReturn._id },
      body: { status: 'Approved', comment: 'Refund approved by admin' },
      user: { id: 'admin_id', role: 'admin' }
    };
    
    let responseData = null;
    const mockRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        responseData = data;
        return this;
      }
    };

    // Initialize Seller Wallet with 2000 withdrawableBalance
    await SellerWallet.create({
      seller: testSeller._id,
      withdrawableBalance: 2000,
      totalEarnings: 2000
    });

    console.log('1. Calling updateReturnStatus to approve refund...');
    await updateReturnStatus(mockReq, mockRes, (err) => { if (err) throw err; });

    console.log(`   Response Success: ${responseData.success}`);
    
    custWallet = await Wallet.findOne({ user: testCustomer._id });
    console.log(`   Customer Wallet Balance after Return Approval: ₹${custWallet.balance} (Expected: ₹2100 = 600 + 1500)`);

    const sellerWallet = await SellerWallet.findOne({ seller: testSeller._id });
    // Commission is 10%, so net seller refund deduction is: 1500 - 150 = 1350.
    // 2000 - 1350 = 650.
    console.log(`   Seller Wallet Withdrawable Balance after Refund Deduction: ₹${sellerWallet.withdrawableBalance} (Expected: ₹650)`);

    if (custWallet.balance !== 2100 || sellerWallet.withdrawableBalance !== 650) {
      throw new Error('Verification 2 (Refund Sync) Failed!');
    }

    console.log('2. Attempting a duplicate refund execution (idempotency key protection check)...');
    // Invoke the same update status flow again - the walletService should block duplicate credit/debit
    await walletService.creditUserWallet(
      testCustomer._id,
      1500,
      'refund_credit',
      `Refund for returned items in Order ${testOrder._id}`,
      testReturn._id,
      `refund_credit_${testReturn._id}`
    );

    custWallet = await Wallet.findOne({ user: testCustomer._id });
    console.log(`   Customer Wallet Balance after duplicate credit attempt: ₹${custWallet.balance} (Expected: ₹2100 - no change)`);
    if (custWallet.balance !== 2100) {
      throw new Error('Verification 2 (Refund Idempotency Block) Failed!');
    }
    console.log('✅ VERIFICATION 2 PASSED!\n');

    // ==========================================
    // VERIFICATION 3: Cash On Delivery Reconciliation Loop
    // ==========================================
    console.log('--- 🚚 VERIFICATION 3: Cash On Delivery Settlement Reconciliation ---');
    
    // Create undeposited COD orders
    const codOrder1 = await Order.create({
      user: testCustomer._id,
      seller: testSeller._id,
      sellerType: 'Seller',
      deliveryBoy: testDelivery._id,
      orderItems: [{
        product: testProduct._id,
        name: testProduct.name,
        image: 'https://example.com/image.png',
        quantity: 1,
        price: 1500,
        seller: testSeller._id,
        sellerType: 'Seller'
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        mobileNumber: '9999988888',
        pincode: '302001',
        city: 'Jaipur',
        fullAddress: '123 Test Street'
      },
      itemsPrice: 1500,
      shippingPrice: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalPrice: 1500,
      paymentMethod: 'COD',
      isPaid: false,
      isDelivered: true,
      status: 'Delivered',
      deliveryStatus: 'Delivered',
      isCashDeposited: false
    });

    const codOrder2 = await Order.create({
      user: testCustomer._id,
      seller: testSeller._id,
      sellerType: 'Seller',
      deliveryBoy: testDelivery._id,
      orderItems: [{
        product: testProduct._id,
        name: testProduct.name,
        image: 'https://example.com/image.png',
        quantity: 1,
        price: 800,
        seller: testSeller._id,
        sellerType: 'Seller'
      }],
      shippingAddress: {
        fullName: 'Test Customer',
        mobileNumber: '9999988888',
        pincode: '302001',
        city: 'Jaipur',
        fullAddress: '123 Test Street'
      },
      itemsPrice: 800,
      shippingPrice: 0,
      taxAmount: 0,
      discountAmount: 0,
      totalPrice: 800,
      paymentMethod: 'COD',
      isPaid: false,
      isDelivered: true,
      status: 'Delivered',
      deliveryStatus: 'Delivered',
      isCashDeposited: false
    });

    // Record earnings & COD collected cash in ledger
    console.log('1. Recording delivery earnings & cash collected liability in ledger...');
    await walletService.recordDeliveryEarning(testDelivery._id, codOrder1._id, true, 1500);
    await walletService.recordDeliveryEarning(testDelivery._id, codOrder2._id, true, 800);

    let delWallet = await DeliveryWallet.findOne({ deliveryPartner: testDelivery._id });
    console.log(`   Delivery Boy COD Cash Collected Liability: ₹${delWallet.codCollectionLiability} (Expected: ₹2300 = 1500 + 800)`);
    console.log(`   Delivery Boy Earnings Balance: ₹${delWallet.earningsBalance} (Expected: ₹100 = 50 + 50)`);

    if (delWallet.codCollectionLiability !== 2300 || delWallet.earningsBalance !== 100) {
      throw new Error('Verification 3 (COD Earning Record) Failed!');
    }

    // Call Admin Confirm Cash Deposit controller
    const adminReq = {
      params: { deliveryBoyId: testDelivery._id },
      user: { id: 'admin_id', role: 'admin' }
    };
    
    let adminResponseData = null;
    const adminRes = {
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        adminResponseData = data;
        return this;
      }
    };

    console.log('2. Admin confirming cash deposit...');
    await confirmCashDeposit(adminReq, adminRes, (err) => { if (err) throw err; });
    console.log(`   Admin confirm response message: "${adminResponseData.message}"`);

    delWallet = await DeliveryWallet.findOne({ deliveryPartner: testDelivery._id });
    console.log(`   Delivery Boy COD Liability after Admin Confirmation: ₹${delWallet.codCollectionLiability} (Expected: ₹0)`);

    const updatedOrder1 = await Order.findById(codOrder1._id);
    const updatedOrder2 = await Order.findById(codOrder2._id);
    console.log(`   Order 1 Cash Deposited Flag: ${updatedOrder1.isCashDeposited} (Expected: true)`);
    console.log(`   Order 2 Cash Deposited Flag: ${updatedOrder2.isCashDeposited} (Expected: true)`);

    if (delWallet.codCollectionLiability !== 0 || !updatedOrder1.isCashDeposited || !updatedOrder2.isCashDeposited) {
      throw new Error('Verification 3 (COD Deposit Confirmation) Failed!');
    }

    // Verify re-entrancy / duplicate settlement prevention
    console.log('3. Triggering a re-entrant / duplicate confirmCashDeposit attempt...');
    let dupResponseData = null;
    const dupRes = {
      status: function(code) { return this; },
      json: function(data) { dupResponseData = data; return this; }
    };

    await confirmCashDeposit(adminReq, dupRes, (err) => { if (err) throw err; });
    console.log(`   Duplicate response message: "${dupResponseData.message}"`);
    
    delWallet = await DeliveryWallet.findOne({ deliveryPartner: testDelivery._id });
    const settlementsCount = await DeliverySettlement.countDocuments({ deliveryPartner: testDelivery._id });
    console.log(`   Total Settlement Ledger Records: ${settlementsCount} (Expected: 1)`);
    console.log(`   Delivery Boy COD Liability after duplicate: ₹${delWallet.codCollectionLiability} (Expected: ₹0)`);

    if (settlementsCount !== 1) {
      throw new Error('Verification 3 (COD Settlement Idempotency Check) Failed!');
    }

    console.log('✅ VERIFICATION 3 PASSED!\n');

    // ==========================================
    // VERIFICATION 4: Idempotent Referral Rewards
    // ==========================================
    console.log('--- 👥 VERIFICATION 4: Idempotent Referral Rewards ---');
    
    const testReferral = await Referral.create({
      referrer: testReferrer._id,
      referredUser: testCustomer._id,
      rewardStatus: 'pending',
      referredUserReward: 100,
      referrerReward: 200,
      signupIp: '127.0.0.1'
    });

    console.log('1. Executing processSignupReward twice in parallel...');
    const signupPromise1 = referralService.processSignupReward(testCustomer._id);
    const signupPromise2 = referralService.processSignupReward(testCustomer._id);
    await Promise.all([signupPromise1, signupPromise2]);

    custWallet = await Wallet.findOne({ user: testCustomer._id });
    console.log(`   Referred Customer Wallet Balance: ₹${custWallet.balance} (Expected: ₹2200 = 2100 + 100)`);
    
    if (custWallet.balance !== 2200) {
      throw new Error('Verification 4 (Signup Reward Idempotency) Failed!');
    }

    console.log('2. Executing processFirstOrderReward twice in parallel...');
    const firstOrderPromise1 = referralService.processFirstOrderReward(testCustomer._id, testOrder._id);
    const firstOrderPromise2 = referralService.processFirstOrderReward(testCustomer._id, testOrder._id);
    await Promise.all([firstOrderPromise1, firstOrderPromise2]);

    const refWallet = await Wallet.findOne({ user: testReferrer._id });
    console.log(`   Referrer Wallet Balance: ₹${refWallet.balance} (Expected: ₹200)`);

    const updatedReferral = await Referral.findById(testReferral._id);
    console.log(`   Referral status in database: "${updatedReferral.rewardStatus}" (Expected: "rewarded")`);

    if (refWallet.balance !== 200 || updatedReferral.rewardStatus !== 'rewarded') {
      throw new Error('Verification 4 (First Order Reward Idempotency) Failed!');
    }

    console.log('✅ VERIFICATION 4 PASSED!\n');

    // Clean up test collections
    console.log('--- 🧹 Cleaning up Test Records ---');
    await Wallet.deleteMany({ user: { $in: [testCustomer._id, testReferrer._id] } });
    await DeliveryWallet.deleteOne({ deliveryPartner: testDelivery._id });
    await SellerWallet.deleteOne({ seller: testSeller._id });
    await Referral.deleteMany({ referredUser: testCustomer._id });
    await Order.deleteMany({ user: testCustomer._id });
    await Return.deleteMany({ user: testCustomer._id });
    await DeliverySettlement.deleteMany({ deliveryPartner: testDelivery._id });
    console.log('Cleanup completed successfully!');

    console.log('\n🌟 CONGRATULATIONS! ALL FINTECH SAFETY AND FINANCIAL CONSISTENCY CHECKS PASSED GLAWLESSLY!');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILED WITH ERROR:', err);
    process.exit(1);
  }
}

runFintechVerification();
