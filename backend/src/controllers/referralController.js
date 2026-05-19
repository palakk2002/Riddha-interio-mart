const User = require('../models/User');
const Referral = require('../models/Referral');
const Wallet = require('../models/Wallet');
const referralService = require('../services/referralService');

/**
   * @desc    Get current user's wallet balance and transactions
   * @route   GET /api/referrals/wallet
   * @access  Private
   */
exports.getWallet = async (req, res, next) => {
  try {
    let wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet) {
      wallet = await Wallet.create({ user: req.user.id, balance: 0, transactions: [] });
    }

    // Securely recalculate active balance on the fly to handle dynamic expirations
    wallet.balance = referralService._calculateActiveBalance(wallet.transactions);
    await wallet.save();

    res.status(200).json({
      success: true,
      data: wallet
    });
  } catch (err) {
    next(err);
  }
};

/**
   * @desc    Get referral analytics for the current user
   * @route   GET /api/referrals/analytics
   * @access  Private
   */
exports.getReferralAnalytics = async (req, res, next) => {
  try {
    const totalReferred = await Referral.countDocuments({ referrer: req.user.id });
    const successfulReferred = await Referral.countDocuments({ referrer: req.user.id, rewardStatus: 'rewarded' });
    const pendingReferred = await Referral.countDocuments({ referrer: req.user.id, rewardStatus: 'pending' });

    // Calculate total earned via referral bonus
    const wallet = await Wallet.findOne({ user: req.user.id });
    let totalEarned = 0;
    if (wallet) {
      totalEarned = wallet.transactions
        .filter(t => t.type === 'referral_bonus' && t.status === 'active')
        .reduce((sum, t) => sum + t.amount, 0);
    }

    res.status(200).json({
      success: true,
      data: {
        referralCode: req.user.referralCode,
        totalReferred,
        successfulReferred,
        pendingReferred,
        totalEarned
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
   * @desc    Get top referrers leaderboard
   * @route   GET /api/referrals/leaderboard
   * @access  Public
   */
exports.getReferralLeaderboard = async (req, res, next) => {
  try {
    // Fetch top 10 users by referralCount
    const leaderboard = await User.find({ role: 'user', referralCount: { $gt: 0 } })
      .select('fullName referralCount avatar')
      .sort({ referralCount: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (err) {
    next(err);
  }
};

/**
   * @desc    Get user's referred history list
   * @route   GET /api/referrals/history
   * @access  Private
   */
exports.getReferralHistory = async (req, res, next) => {
  try {
    const referrals = await Referral.find({ referrer: req.user.id })
      .populate('referredUser', 'fullName email createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: referrals.length,
      data: referrals
    });
  } catch (err) {
    next(err);
  }
};

/**
   * @desc    Admin adjusts a user's wallet manually
   * @route   POST /api/referrals/admin/adjust-wallet
   * @access  Private (Admin)
   */
exports.adminAdjustWallet = async (req, res, next) => {
  try {
    const { userId, amount, type, description } = req.body;
    if (!userId || amount === undefined) {
      return res.status(400).json({ success: false, error: 'Please provide userId and amount' });
    }

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user: userId, balance: 0, transactions: [] });
    }

    wallet.transactions.push({
      amount: Number(amount),
      type: type || 'manual_adjustment',
      description: description || 'Admin manual balance adjustment',
      status: 'active'
    });

    wallet.balance = referralService._calculateActiveBalance(wallet.transactions);
    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Wallet balance successfully adjusted by admin.',
      data: wallet
    });
  } catch (err) {
    next(err);
  }
};

/**
   * @desc    Admin views all referral tracking logs in the system
   * @route   GET /api/referrals/admin/logs
   * @access  Private (Admin)
   */
exports.adminGetAllReferrals = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    const total = await Referral.countDocuments();
    const referrals = await Referral.find()
      .populate('referrer', 'fullName email')
      .populate('referredUser', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      count: referrals.length,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: referrals
    });
  } catch (err) {
    next(err);
  }
};
