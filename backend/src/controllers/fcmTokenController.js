const FCMToken = require('../models/FCMToken');

// @desc    Register / Upsert FCM Token
// @route   POST /api/notifications/fcm-token
// @access  Private
exports.registerFCMToken = async (req, res, next) => {
  try {
    const { token, platform = 'web' } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Registration token is required.' });
    }

    const userId = req.user.id;
    
    // Dynamically map role to matching recipient Model name
    let userModel = 'User';
    if (req.user.role === 'admin') userModel = 'Admin';
    else if (req.user.role === 'seller') userModel = 'Seller';
    else if (req.user.role === 'delivery') userModel = 'Delivery';

    // 1. Check if token already registered for this user
    let tokenDoc = await FCMToken.findOne({ token });
    if (tokenDoc) {
      tokenDoc.user = userId;
      tokenDoc.userModel = userModel;
      tokenDoc.platform = platform;
      tokenDoc.lastUsedAt = Date.now();
      await tokenDoc.save();
    } else {
      // Create new token
      tokenDoc = await FCMToken.create({
        user: userId,
        userModel,
        token,
        platform,
        lastUsedAt: Date.now()
      });
    }

    // 2. Bound limit: max 10 devices per user to prevent storage bloat
    const userTokensCount = await FCMToken.countDocuments({ user: userId, userModel });
    if (userTokensCount > 10) {
      // Remove oldest tokens exceeding bound limit
      const oldestTokens = await FCMToken.find({ user: userId, userModel })
        .sort({ lastUsedAt: 1 })
        .limit(userTokensCount - 10);
      const oldestIds = oldestTokens.map(doc => doc._id);
      await FCMToken.deleteMany({ _id: { $in: oldestIds } });
    }

    res.status(200).json({
      success: true,
      message: 'FCM registration token synchronized successfully.',
      data: tokenDoc
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Revoke / Remove FCM Token (Logout)
// @route   DELETE /api/notifications/fcm-token
// @access  Private
exports.revokeFCMToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, error: 'Token parameter is required for revocation.' });
    }

    const userId = req.user.id;

    // Delete exact matching fcm token document
    const result = await FCMToken.findOneAndDelete({ token, user: userId });

    res.status(200).json({
      success: true,
      message: result ? 'FCM registration token revoked successfully.' : 'Token already inactive or not found.'
    });
  } catch (err) {
    next(err);
  }
};
