const RefreshToken = require('../models/RefreshToken');
const tokenService = require('./tokenService');

// Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
  try {
    const role = user.role || 'user';
    const userId = user._id;

    // Generate access and refresh tokens
    const accessToken = tokenService.generateAccessToken(userId, role);
    const refreshToken = tokenService.generateRefreshToken(userId, role);
    const tokenHash = tokenService.hashToken(refreshToken);

    // Save refresh token to database
    const req = res.req;
    const userAgent = req ? (req.headers['user-agent'] || '') : '';
    const ipAddress = req ? (req.ip || req.connection?.remoteAddress || '') : '';
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      tokenHash,
      userId,
      userRole: role,
      expiresAt,
      userAgent,
      ipAddress
    });

    // Set access_token and refresh_token in httpOnly cookies
    tokenService.setAuthCookies(res, accessToken, refreshToken);

    // Send response exposing tokens in the body for development and fallback local storage support
    res.status(statusCode).json({
      success: true,
      token: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: role,
        token: accessToken, // Nested token for frontend compatibility
        // Include common fields
        avatar: user.avatar || "",
        phone: user.phone || "",
        // Include role-specific fields
        shopName: user.shopName || "",
        shopAddress: user.shopAddress || "",
        vehicleType: user.vehicleType || "",
        vehicleNumber: user.vehicleNumber || "",
        isVerified: user.isVerified || false,
        approvalStatus: user.approvalStatus || "",
        type: user.type || "standard",
        permissions: user.permissions || {}
      }
    });
  } catch (err) {
    console.error('sendTokenResponse Error:', err.message);
    res.status(500).json({ success: false, error: 'Authentication dispatch error' });
  }
};

module.exports = sendTokenResponse;
