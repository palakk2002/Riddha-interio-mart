const User = require('../models/User');
const sendTokenResponse = require('../utils/sendTokenResponse');
const checkEmailExists = require('../utils/checkEmailExists');

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (await checkEmailExists(email)) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const user = await User.create({ fullName, email, password });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, error: 'Please provide email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in User
// @route   GET /api/auth/me
// @access  Private
exports.getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};
