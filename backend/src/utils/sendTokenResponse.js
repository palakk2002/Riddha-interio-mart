// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      // Include common fields
      avatar: user.avatar || "",
      phone: user.phone || "",
      // Include role-specific fields
      shopName: user.shopName || "",
      shopAddress: user.shopAddress || "",
      vehicleType: user.vehicleType || "",
      vehicleNumber: user.vehicleNumber || "",
      isVerified: user.isVerified || false,
      approvalStatus: user.approvalStatus || ""
    }
  });
};

module.exports = sendTokenResponse;
