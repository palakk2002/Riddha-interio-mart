const User = require('../models/User');
const sendTokenResponse = require('../utils/sendTokenResponse');
const checkEmailExists = require('../utils/checkEmailExists');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, userType, businessDetails } = req.body;

    if (await checkEmailExists(email)) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }

    const user = await User.create({ 
      fullName, 
      email, 
      password,
      userType: userType || 'customer',
      businessDetails: userType === 'enterpriser' ? businessDetails : undefined,
      isEmailVerified: false
    });

    // Generate Verification OTP
    const otp = user.getVerificationOtp();
    await user.save({ validateBeforeSave: false });

    // Send email
    const message = `Welcome to Riddha Mart!\n\nYour email verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Riddha Mart - Verify Your Email',
        message
      });

      res.status(201).json({ 
        success: true, 
        message: 'Registration successful. Please verify your email.',
        email: user.email
      });
    } catch (err) {
      console.error(err);
      user.emailVerificationOtp = undefined;
      user.emailVerificationOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
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

    if (!user.isEmailVerified) {
      return res.status(401).json({ success: false, error: 'Please verify your email', unverified: true, email: user.email });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Get current logged in User
exports.getUserMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// @desc    Update User Profile
exports.updateUserProfile = async (req, res, next) => {
  try {
    const { fullName, email, phone, avatar } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Check if email is being changed and if new email is already taken
    if (email && email !== user.email) {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ success: false, error: 'Email already in use by another account' });
      }
    }

    const fieldsToUpdate = {
      fullName: fullName || user.fullName,
      email: email || user.email,
      phone: phone || user.phone,
      avatar: avatar || user.avatar
    };

    const updatedUser = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
};

// @desc    Verify Email OTP
// @route   POST /api/auth/verify-email
// @access  Public
exports.verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, error: 'Please provide email and OTP' });

    // Hash OTP to match db
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      emailVerificationOtp: hashedOtp,
      emailVerificationOtpExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });
    }

    // Set verified
    user.isEmailVerified = true;
    user.emailVerificationOtp = undefined;
    user.emailVerificationOtpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // Log them in immediately after verification
    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Resend Verification OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendVerificationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Please provide email' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (user.isEmailVerified) return res.status(400).json({ success: false, error: 'Email already verified' });

    const otp = user.getVerificationOtp();
    await user.save({ validateBeforeSave: false });

    const message = `Welcome to Riddha Mart!\n\nYour new email verification OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Riddha Mart - Verify Your Email',
        message
      });

      res.status(200).json({ success: true, message: 'OTP sent' });
    } catch (err) {
      user.emailVerificationOtp = undefined;
      user.emailVerificationOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, error: 'There is no user with that email' });

    const otp = user.getResetPasswordOtp();
    await user.save({ validateBeforeSave: false });

    const message = `You are receiving this email because you requested the reset of a password. \n\nYour password reset OTP is: ${otp}\n\nThis OTP is valid for 10 minutes.`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Riddha Mart - Password Reset OTP',
        message
      });

      res.status(200).json({ success: true, message: 'OTP sent' });
    } catch (err) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, error: 'Email could not be sent' });
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password via OTP
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) return res.status(400).json({ success: false, error: 'Please provide email, OTP, and new password' });

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email,
      resetPasswordOtp: hashedOtp,
      resetPasswordOtpExpire: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired OTP' });

    // Set new password
    user.password = password;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpire = undefined;
    await user.save(); // Don't skip validation so password hashes

    res.status(200).json({ success: true, message: 'Password successfully reset. You can now login.' });
  } catch (err) {
    next(err);
  }
};
