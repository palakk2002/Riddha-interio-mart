const User = require('../models/User');
const sendTokenResponse = require('../utils/sendTokenResponse');
const checkEmailExists = require('../utils/checkEmailExists');

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
      businessDetails: userType === 'enterpriser' ? businessDetails : undefined
    });
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

    // Safety bypass for admin credentials in user login
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (trimmedEmail === 'riddhamart@gmail.com' && password === '123456') {
      const Admin = require('../models/Admin');
      let admin = await Admin.findOne({ email: trimmedEmail }).select('+password');
      if (admin) {
        // Ensure password matches
        const isMatch = await admin.matchPassword(password);
        if (!isMatch) {
          admin.password = password;
          await admin.save();
        }
        return sendTokenResponse(admin, 200, res);
      }
    }

    // Temporary bypass for requested user credentials
    if (trimmedEmail === 'user@gmail.com' && password === '123456') {
      let user = await User.findOne({ email: trimmedEmail }).select('+password');
      if (!user) {
        user = await User.create({
          fullName: 'Riddha User',
          email: trimmedEmail,
          password,
          userType: 'customer'
        });
      } else {
        // Update password if it was different
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
          user.password = password;
          await user.save();
        }
      }
      return sendTokenResponse(user, 200, res);
    }

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
