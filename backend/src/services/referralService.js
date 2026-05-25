const mongoose = require('mongoose');
const User = require('../models/User');
const Referral = require('../models/Referral');
const Wallet = require('../models/Wallet');
const ReferralSettings = require('../models/ReferralSettings');
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

    // Load dynamic settings
    let settings = await ReferralSettings.findOne();
    if (!settings) {
      settings = await ReferralSettings.create({
        isEnabled: true,
        referrerReward: 100,
        newUserReward: 50
      });
    }

    // If disabled, skip referral tracking gracefully
    if (!settings.isEnabled) {
      return null;
    }

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
      referredUserReward: settings.newUserReward,
      referrerReward: settings.referrerReward,
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
    if (!referral) return;

    const walletService = require('./walletService');
    const signupBonus = referral.referredUserReward;
    const expirationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days validity
    const signupIdempotencyKey = `signup_reward_${referredUserId}`;

    await walletService.creditUserWallet(
      referredUserId,
      signupBonus,
      'signup_bonus',
      'Signup bonus using referral code',
      referral._id,
      signupIdempotencyKey,
      expirationDate
    );
  }

  /**
   * Triggers referral bonus when referred user completes their first order
   */
  async processFirstOrderReward(referredUserId, orderId) {
    const referral = await Referral.findOne({ referredUser: referredUserId, rewardStatus: 'pending' });
    if (!referral) return;

    const walletService = require('./walletService');
    const referrerId = referral.referrer;
    const referralBonus = referral.referrerReward;
    const expirationDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days validity
    const firstOrderIdempotencyKey = `first_order_reward_${referredUserId}_${orderId}`;

    // Credit reward to referrer atomically
    await walletService.creditUserWallet(
      referrerId,
      referralBonus,
      'referral_bonus',
      'Reward for inviting a friend who placed an order',
      orderId,
      firstOrderIdempotencyKey,
      expirationDate
    );

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
