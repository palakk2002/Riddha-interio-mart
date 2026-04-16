const Delivery = require('../models/Delivery');
const sendTokenResponse = require('../utils/sendTokenResponse');
const checkEmailExists = require('../utils/checkEmailExists');

// @desc    Register Delivery Partner
// @route   POST /api/auth/delivery/register
// @access  Public
exports.registerDelivery = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, vehicleType, vehicleNumber } = req.body;

    if (await checkEmailExists(email)) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const delivery = await Delivery.create({ fullName, email, password, phone, vehicleType, vehicleNumber });
    sendTokenResponse(delivery, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login Delivery Partner
// @route   POST /api/auth/delivery/login
// @access  Public
exports.loginDelivery = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

    const delivery = await Delivery.findOne({ email }).select('+password');
    if (!delivery || !(await delivery.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(delivery, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in Delivery Partner
// @route   GET /api/auth/delivery/me
// @access  Private
exports.getDeliveryMe = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.user.id);
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};
