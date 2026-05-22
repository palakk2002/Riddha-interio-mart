const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Seller = require('../src/models/Seller');
const SellerWallet = require('../src/models/SellerWallet');
const SellerPayout = require('../src/models/SellerPayout');
const walletService = require('../src/services/walletService');

async function runTest() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected successfully!');

    // 1. Find or create a dummy seller
    let seller = await Seller.findOne({ email: 'concurrency_test_seller@test.com' });
    if (!seller) {
      seller = await Seller.create({
        fullName: 'Concurrency Test Seller',
        email: 'concurrency_test_seller@test.com',
        shopName: 'Test Concurrency Shop',
        password: 'password123',
        bankDetails: {
          accountHolderName: 'Concurrency Test Seller',
          accountNumber: '123456789012',
          ifscCode: 'ICIC0001234',
          bankName: 'ICICI Bank'
        }
      });
      console.log('Created dummy test seller profile');
    } else {
      // Ensure the seller has bankDetails configured
      seller.bankDetails = {
        accountHolderName: 'Concurrency Test Seller',
        accountNumber: '123456789012',
        ifscCode: 'ICIC0001234',
        bankName: 'ICICI Bank'
      };
      await seller.save();
      console.log('Ensured dummy seller has bank details configured');
    }

    // 2. Clear old test wallet & payout logs for this seller to have a fresh state
    await SellerWallet.deleteOne({ seller: seller._id });
    await SellerPayout.deleteMany({ seller: seller._id });
    console.log('Cleared previous test records');

    // 3. Initialize the wallet with exactly ₹5,000 withdrawableBalance
    const wallet = await SellerWallet.create({
      seller: seller._id,
      withdrawableBalance: 5000,
      pendingBalance: 0,
      totalEarnings: 5000
    });
    console.log(`Initialized test wallet with withdrawableBalance = ₹${wallet.withdrawableBalance}`);

    // 4. Trigger 5 concurrent withdrawal requests of ₹5,000 simultaneously!
    console.log('\n🚀 Triggering 5 concurrent payout requests of ₹5,000 simultaneously...');
    
    const requests = [];
    for (let i = 1; i <= 5; i++) {
      requests.push(
        walletService.requestSellerPayout(seller._id, 5000)
          .then((payout) => {
            return { index: i, success: true, payoutId: payout._id };
          })
          .catch((err) => {
            return { index: i, success: false, error: err.message };
          })
      );
    }

    const results = await Promise.all(requests);

    console.log('\n📊 Concurrency Test Results:');
    results.forEach((r) => {
      if (r.success) {
        console.log(`  Request #${r.index}: ✅ SUCCESS! Created Payout Request ID: ${r.payoutId}`);
      } else {
        console.log(`  Request #${r.index}: ❌ FAILED! Reason: ${r.error}`);
      }
    });

    // 5. Assertions
    const finalWallet = await SellerWallet.findOne({ seller: seller._id });
    const finalPayouts = await SellerPayout.find({ seller: seller._id });

    console.log('\n🔎 Post-Execution Ledger Integrity Assessment:');
    console.log(`  * Final Wallet Balance: ₹${finalWallet.withdrawableBalance}`);
    console.log(`  * Total Payout Requests in Database: ${finalPayouts.length}`);
    console.log(`  * Ledger Transaction Entries: ${finalWallet.transactions.length}`);

    const successfulRequests = results.filter(r => r.success);
    const failedRequests = results.filter(r => !r.success);

    let passed = true;
    if (successfulRequests.length !== 1) {
      console.log('  ❌ FAILURE: Exactly 1 request should have succeeded!');
      passed = false;
    }
    if (finalWallet.withdrawableBalance !== 0) {
      console.log('  ❌ FAILURE: Final wallet balance must be exactly ₹0!');
      passed = false;
    }
    if (finalPayouts.length !== 1) {
      console.log('  ❌ FAILURE: Exactly 1 SellerPayout document should exist!');
      passed = false;
    }

    if (passed) {
      console.log('\n🎉 SUCCESS: All concurrency safety assertions PASSED! The double-spending exploit has been blocked.');
    } else {
      console.log('\n⚠️ TEST FAILED: Ledger integrity violated.');
    }

    process.exit(passed ? 0 : 1);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTest();
