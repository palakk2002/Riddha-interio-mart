const Seller = require('../models/Seller');
const sendTokenResponse = require('../utils/sendTokenResponse');
const checkEmailExists = require('../utils/checkEmailExists');

// @desc    Register Seller
// @route   POST /api/auth/seller/register
// @access  Public
exports.registerSeller = async (req, res, next) => {
  try {
    const { fullName, email, password, shopName, shopAddress, phone } = req.body;

    if (await checkEmailExists(email)) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const seller = await Seller.create({ fullName, email, password, shopName, shopAddress, phone });
    sendTokenResponse(seller, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login Seller
// @route   POST /api/auth/seller/login
// @access  Public
exports.loginSeller = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

    const seller = await Seller.findOne({ email }).select('+password');
    if (!seller || !(await seller.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(seller, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in Seller
// @route   GET /api/auth/seller/me
// @access  Private
exports.getSellerMe = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.user.id);
    res.status(200).json({ success: true, data: seller });
  } catch (err) {
    next(err);
  }
};
