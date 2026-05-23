const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const User = require('../src/models/User');
const Seller = require('../src/models/Seller');
const Product = require('../src/models/Product');
const Brand = require('../src/models/Brand');
const Order = require('../src/models/Order');
const Review = require('../src/models/Review');

const {
  createReview,
  respondToReview,
  getSellerReviews,
  deleteReview
} = require('../src/controllers/reviewController');

// Mock response factory
function createMockResponse() {
  const res = {
    statusCode: 200,
    jsonData: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.jsonData = data;
      return this;
    }
  };
  return res;
}

async function runTest() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // Clean up any legacy test data
    console.log('Cleaning up previous test data...');
    await User.deleteMany({ email: /@review-test\.com$/ });
    await Seller.deleteMany({ email: /@review-test\.com$/ });
    await Product.deleteMany({ name: /\[Review Test\]/ });
    await Brand.deleteMany({ name: /\[Review Test\]/ });
    await Order.deleteMany({ 'shippingAddress.fullName': /\[Review Test\]/ });
    await Review.deleteMany({}); // Clears any reviews to verify rating calculations perfectly

    // 1. Create a dummy Brand
    const brand = await Brand.create({
      name: '[Review Test] Brand',
      image: 'test.jpg',
      isActive: true
    });

    // 2. Create a dummy Seller
    const seller = await Seller.create({
      fullName: 'Review Test Seller',
      email: 'seller@review-test.com',
      shopName: 'Test Review Shop',
      password: 'password123',
      bankDetails: {
        accountHolderName: 'Review Test Seller',
        accountNumber: '123456789012',
        ifscCode: 'ICIC0001234',
        bankName: 'ICICI Bank'
      }
    });

    // 3. Create a dummy Product owned by the Seller
    const product = await Product.create({
      name: '[Review Test] Product',
      description: 'Super awesome test product',
      price: 1500,
      category: 'Home & Kitchen',
      brand: brand._id,
      countInStock: 100,
      seller: seller._id,
      sellerType: 'Seller',
      approvalStatus: 'approved',
      isApproved: true,
      images: ['https://via.placeholder.com/150']
    });

    // 4. Create a dummy User (customer)
    const user = await User.create({
      fullName: 'Review Test Customer',
      email: 'customer@review-test.com',
      role: 'user',
      password: 'password123'
    });

    console.log('\n--- 🧪 TEST 1: Verified Purchase Order Time Restriction ---');

    // Case A: No order exists -> should fail
    {
      const req = {
        params: { productId: product._id.toString() },
        user: { id: user._id.toString(), role: 'user' },
        body: { rating: 5, review: 'Fantastic quality!' }
      };
      const res = createMockResponse();
      await createReview(req, res);
      console.log(`  * No Order Exist: Code ${res.statusCode}, Message: ${res.jsonData.message}`);
      if (res.statusCode !== 403) throw new Error('Should block users with no orders');
    }

    // Case B: Delivered Order older than 180 days -> should fail
    const oldDate = new Date(Date.now() - 185 * 24 * 60 * 60 * 1000);
    const oldOrder = await Order.create({
      user: user._id,
      seller: seller._id,
      sellerType: 'Seller',
      shippingAddress: {
        fullName: '[Review Test] Name',
        mobileNumber: '9999999999',
        pincode: '400001',
        city: 'Mumbai',
        fullAddress: 'Test Road'
      },
      paymentMethod: 'Online',
      itemsPrice: 1500,
      totalPrice: 1500,
      isPaid: true,
      status: 'Delivered',
      isDelivered: true,
      deliveredAt: oldDate,
      orderItems: [{
        name: product.name,
        quantity: 1,
        image: product.images[0],
        price: product.price,
        product: product._id,
        seller: seller._id,
        sellerType: 'Seller'
      }]
    });

    {
      const req = {
        params: { productId: product._id.toString() },
        user: { id: user._id.toString(), role: 'user' },
        body: { rating: 5, review: 'Superb quality!' }
      };
      const res = createMockResponse();
      await createReview(req, res);
      console.log(`  * Order > 180 days ago: Code ${res.statusCode}, Message: ${res.jsonData.message}`);
      if (res.statusCode !== 403) throw new Error('Should block orders older than 180 days');
    }

    // Case C: Delivered Order within 180 days -> should succeed!
    const recentDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
    await Order.findByIdAndUpdate(oldOrder._id, { deliveredAt: recentDate });

    let reviewId;
    {
      const req = {
        params: { productId: product._id.toString() },
        user: { id: user._id.toString(), role: 'user' },
        body: { rating: 5, title: 'Amazing', review: 'Highly recommended!' }
      };
      const res = createMockResponse();
      await createReview(req, res);
      console.log(`  * Order <= 180 days ago: Code ${res.statusCode}, Data ID: ${res.jsonData.data?._id}`);
      if (res.statusCode !== 201) throw new Error('Should allow review for recent delivered order');
      reviewId = res.jsonData.data._id;
    }

    console.log('\n--- 🧪 TEST 2: Seller Reply and Editing Response ---');

    // Case A: Submitting seller response for the first time
    {
      const req = {
        params: { id: reviewId.toString() },
        user: { id: seller._id.toString(), role: 'seller' },
        body: { text: 'Thank you for buying from our shop!' }
      };
      const res = createMockResponse();
      await respondToReview(req, res);
      console.log(`  * First Response: Code ${res.statusCode}, Response Text: "${res.jsonData.data?.sellerResponse?.text}"`);
      if (res.statusCode !== 200 || res.jsonData.data.sellerResponse.text !== 'Thank you for buying from our shop!') {
        throw new Error('Seller response failed to submit');
      }
    }

    // Case B: Editing / Overwriting seller response (User selection: allow to edit)
    {
      const req = {
        params: { id: reviewId.toString() },
        user: { id: seller._id.toString(), role: 'seller' },
        body: { text: 'Thank you! We always strive for 100% satisfaction.' }
      };
      const res = createMockResponse();
      await respondToReview(req, res);
      console.log(`  * Edited Response: Code ${res.statusCode}, Response Text: "${res.jsonData.data?.sellerResponse?.text}"`);
      if (res.statusCode !== 200 || res.jsonData.data.sellerResponse.text !== 'Thank you! We always strive for 100% satisfaction.') {
        throw new Error('Seller response failed to update');
      }
    }

    console.log('\n--- 🧪 TEST 3: Null Product Safety Guard in respondToReview ---');

    // Delete the product to orphan the review and test crash-prevention
    await Product.findByIdAndDelete(product._id);
    console.log('  * Product deleted successfully.');

    {
      const req = {
        params: { id: reviewId.toString() },
        user: { id: seller._id.toString(), role: 'seller' },
        body: { text: 'Testing deleted product response...' }
      };
      const res = createMockResponse();
      await respondToReview(req, res);
      console.log(`  * respondToReview with deleted product: Code ${res.statusCode}, Message: "${res.jsonData.message}"`);
      if (res.statusCode !== 404) {
        throw new Error('Should gracefully return 404 instead of throwing an unhandled dereference exception.');
      }
    }

    console.log('\n--- 🧪 TEST 4: Unified Seller Review Dashboard ---');

    // Create a new product and review to populate seller reviews
    const secondProduct = await Product.create({
      name: '[Review Test] Product 2',
      description: 'Second beautiful product',
      price: 2000,
      category: 'Home & Kitchen',
      brand: brand._id,
      countInStock: 50,
      seller: seller._id,
      sellerType: 'Seller',
      approvalStatus: 'approved',
      isApproved: true,
      images: ['https://via.placeholder.com/150']
    });

    const secondOrder = await Order.create({
      user: user._id,
      seller: seller._id,
      sellerType: 'Seller',
      shippingAddress: {
        fullName: '[Review Test] Name',
        mobileNumber: '9999999999',
        pincode: '400001',
        city: 'Mumbai',
        fullAddress: 'Test Road'
      },
      paymentMethod: 'Online',
      itemsPrice: 2000,
      totalPrice: 2000,
      isPaid: true,
      status: 'Delivered',
      isDelivered: true,
      deliveredAt: recentDate,
      orderItems: [{
        name: secondProduct.name,
        quantity: 1,
        image: secondProduct.images[0],
        price: secondProduct.price,
        product: secondProduct._id,
        seller: seller._id,
        sellerType: 'Seller'
      }]
    });

    // Bypass cooldown by modifying database for a quick second review
    const secondReview = await Review.create({
      product: secondProduct._id,
      user: user._id,
      rating: 4,
      title: 'Decent product',
      review: 'Works as expected',
      verifiedPurchase: true
    });

    {
      const req = {
        user: { id: seller._id.toString(), role: 'seller' },
        query: { page: 1, limit: 10 }
      };
      const res = createMockResponse();
      await getSellerReviews(req, res);
      console.log(`  * getSellerReviews: Code ${res.statusCode}, Total Count: ${res.jsonData.totalResults}, Data length: ${res.jsonData.data?.length}`);
      if (res.statusCode !== 200 || res.jsonData.totalResults !== 1) {
        throw new Error('Seller reviews dashboard did not return the expected 1 active review');
      }
    }

    console.log('\n--- 🧪 TEST 5: deleteOne Rating Recalculation Hook ---');

    // Check averageRating of secondProduct (should be 4)
    let freshProduct = await Product.findById(secondProduct._id);
    console.log(`  * Product before deletion: AverageRating = ${freshProduct.averageRating}, TotalReviews = ${freshProduct.totalReviews}`);
    if (freshProduct.averageRating !== 4 || freshProduct.totalReviews !== 1) {
      throw new Error('Average rating should be updated to 4 with 1 review');
    }

    // Now delete the review using document deleteOne() (which simulates controller deletion)
    const reqDelete = {
      params: { id: secondReview._id.toString() },
      user: { id: user._id.toString(), role: 'user' }
    };
    const resDelete = createMockResponse();
    await deleteReview(reqDelete, resDelete);

    console.log(`  * deleteReview: Code ${resDelete.statusCode}`);
    if (resDelete.statusCode !== 200) throw new Error('Failed to delete review');

    freshProduct = await Product.findById(secondProduct._id);
    console.log(`  * Product after deletion: AverageRating = ${freshProduct.averageRating}, TotalReviews = ${freshProduct.totalReviews}`);
    if (freshProduct.averageRating !== 0 || freshProduct.totalReviews !== 0) {
      throw new Error('Average rating failed to recalculate to 0 after deleting the review');
    }

    console.log('\n🎉 SUCCESS: All 5 production-readiness verification tests passed successfully!');

    // Cleanup final test documents
    console.log('Cleaning up remaining test documents...');
    await User.deleteMany({ email: /@review-test\.com$/ });
    await Seller.deleteMany({ email: /@review-test\.com$/ });
    await Product.deleteMany({ name: /\[Review Test\]/ });
    await Brand.deleteMany({ name: /\[Review Test\]/ });
    await Order.deleteMany({ 'shippingAddress.fullName': /\[Review Test\]/ });
    await Review.deleteMany({});

    process.exit(0);
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

runTest();
