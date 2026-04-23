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
exports.getSellerMe = async (req, res, next) => {
  try {
    const seller = await Seller.findById(req.user.id);
    res.status(200).json({ success: true, data: seller });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Seller Profile
exports.updateSellerProfile = async (req, res, next) => {
  try {
    const { fullName, email, phone, shopName, shopAddress, avatar, gstNumber, panNumber } = req.body;
    
    const seller = await Seller.findById(req.user.id);
    if (!seller) return res.status(404).json({ success: false, error: 'Seller not found' });

    // Check if email is being changed and if new email is already taken
    if (email && email !== seller.email) {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ success: false, error: 'Email already in use by another account' });
      }
    }

    const fieldsToUpdate = {
      fullName: fullName || seller.fullName,
      email: email || seller.email,
      phone: phone || seller.phone,
      shopName: shopName || seller.shopName,
      shopAddress: shopAddress || seller.shopAddress,
      avatar: avatar || seller.avatar,
      gstNumber: gstNumber !== undefined ? gstNumber : seller.gstNumber,
      panNumber: panNumber !== undefined ? panNumber : seller.panNumber
    };

    const updatedSeller = await Seller.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: updatedSeller });
  } catch (err) {
    next(err);
  }
};

// @desc    Get seller's stock management report
// @route   GET /api/auth/seller/stock-status
// @access  Private/Seller
exports.getSellerStockStatus = async (req, res, next) => {
  try {
    const Product = require('../models/Product');
    const products = await Product.find({ seller: req.user.id })
      .populate('brand', 'name')
      .sort('countInStock');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
};
