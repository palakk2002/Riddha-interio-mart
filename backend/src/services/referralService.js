const mongoose = require('mongoose');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Wallet = require('../models/Wallet');
const { notifyUserOrderStatus } = require('../socket');

/**
 * Growth & Referral Systems Service Layer
 */
class ReferralService {
  /**
   * Tracks a referral on signup
   */
  async trackReferral(referredUser, referralCode, signupIp, signupFingerprint) {
    if (!referralCode) return null;

    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      throw new Error('Invalid referral code.');
    }

    // Fraud Prevention 1: Self Referral
    if (referrer._id.toString() === referredUser._id.toString()) {
      throw new Error('You cannot refer yourself.');
    }

    // Fraud Prevention 2: IP referral spam limits (max 3 referrals from same IP per day)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentIpReferralsCount = await Referral.countDocuments({
      signupIp,
      createdAt: { $gte: oneDayAgo }
    });

    if (recentIpReferralsCount >= 3) {
      throw new Error('Referral limit exceeded for this network connection.');
    }

    // Set referrer reference on the new user
    referredUser.referredBy = referrer._id;
    await referredUser.save({ validateBeforeSave: false });

    // Create the Referral document
    const referral = await Referral.create({
      referrer: referrer._id,
      referredUser: referredUser._id,
      rewardStatus: 'pending',
      referredUserReward: 50, // Rs. 50 signup credit
      referrerReward: 100,    // Rs. 100 referral reward on purchase
      signupIp,
      signupFingerprint
    });

    return referral;
  }

  /**
   * Triggers signup rewards when referred user verifies their email
   */
  async processSignupReward(referredUserId) {
    const referral = await Referral.findOne({ referredUser: referredUserId, rewardStatus: 'pending' });
    
    // Ensure the referred user has a wallet
    let referredWallet = await Wallet.findOne({ user: referredUserId });
    if (!referredWallet) {
      referredWallet = await Wallet.create({ user: referredUserId, balance: 0 });
    }

    if (referral) {
      // Add signup bonus transaction to referred user's wallet
      const signupBonus = referral.referredUserReward;
      const expirationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days validity

      referredWallet.transactions.push({
        amount: signupBonus,
        type: 'signup_bonus',
        description: 'Signup bonus using referral code',
        status: 'active',
        expiresAt: expirationDate,
        referenceId: referral._id
      });

      // Recalculate balance
      referredWallet.balance = this._calculateActiveBalance(referredWallet.transactions);
      await referredWallet.save();
    }
  }

  /**
   * Triggers referral bonus when referred user completes their first order
   */
  async processFirstOrderReward(referredUserId, orderId) {
    const referral = await Referral.findOne({ referredUser: referredUserId, rewardStatus: 'pending' });
    if (!referral) return;

    // Credit reward to referrer
    const referrerId = referral.referrer;
    let referrerWallet = await Wallet.findOne({ user: referrerId });
    if (!referrerWallet) {
      referrerWallet = await Wallet.create({ user: referrerId, balance: 0 });
    }

    const referralBonus = referral.referrerReward;
    const expirationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days validity

    referrerWallet.transactions.push({
      amount: referralBonus,
      type: 'referral_bonus',
      description: 'Reward for inviting a friend who placed an order',
      status: 'active',
      expiresAt: expirationDate,
      referenceId: orderId
    });

    // Recalculate and update referrer balance
    referrerWallet.balance = this._calculateActiveBalance(referrerWallet.transactions);
    await referrerWallet.save();

    // Increment referrer referralCount
    await User.findByIdAndUpdate(referrerId, { $inc: { referralCount: 1 } });

    // Update referral status
    referral.rewardStatus = 'rewarded';
    await referral.save();

    // Notify referrer
    try {
      const referrerUser = await User.findById(referrerId);
      if (referrerUser) {
        notifyUserOrderStatus(referrerId, {
          title: 'Referral Reward Credited!',
          message: `Congratulations! Your friend placed their first order. ₹${referralBonus} has been credited to your wallet.`,
          type: 'payment_success',
          metadata: { amount: referralBonus, orderId }
        });
      }
    } catch (e) {
      console.error('Failed to notify referrer:', e.message);
    }
  }

  /**
   * Helper to compute active balance considering only active and unexpired transactions
   */
  _calculateActiveBalance(transactions) {
    let balance = 0;
    const now = new Date();

    for (const tx of transactions) {
      // Check expiration for positive balances
      if (tx.amount > 0 && tx.status === 'active' && tx.expiresAt && tx.expiresAt < now) {
        tx.status = 'expired';
      }

      if (tx.status === 'active') {
        balance += tx.amount;
      }
    }

    return Number(balance.toFixed(2));
  }
}

module.exports = new ReferralService();
