const Delivery = require('../models/Delivery');
const sendTokenResponse = require('../utils/sendTokenResponse');
const checkEmailExists = require('../utils/checkEmailExists');
const { notifyAdminNewDelivery, notifyDeliveryApproval } = require('../socket');

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
    
    // Notify Admin about new registration
    notifyAdminNewDelivery({
      id: delivery._id,
      fullName: delivery.fullName,
      email: delivery.email,
      phone: delivery.phone,
      vehicleType: delivery.vehicleType
    });

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
exports.getDeliveryMe = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.user.id);
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

// @desc    Update Delivery Profile
exports.updateDeliveryProfile = async (req, res, next) => {
  try {
    const { fullName, email, phone, vehicleType, vehicleNumber, avatar } = req.body;
    
    const delivery = await Delivery.findById(req.user.id);
    if (!delivery) return res.status(404).json({ success: false, error: 'Partner not found' });

    // Check if email is being changed and if new email is already taken
    if (email && email !== delivery.email) {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        return res.status(400).json({ success: false, error: 'Email already in use by another account' });
      }
    }

    const fieldsToUpdate = {
      fullName: fullName || delivery.fullName,
      email: email || delivery.email,
      phone: phone || delivery.phone,
      vehicleType: vehicleType || delivery.vehicleType,
      vehicleNumber: vehicleNumber || delivery.vehicleNumber,
      avatar: avatar || delivery.avatar
    };

    const updatedDelivery = await Delivery.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: updatedDelivery });
  } catch (err) {
    next(err);
  }
};

// @desc    Get available delivery partners
// @route   GET /api/delivery/available
// @access  Private/Seller
exports.getAvailableDeliveryBoys = async (req, res, next) => {
  try {
    const deliveryBoys = await Delivery.find({ status: 'Available', approvalStatus: 'Approved' }).select('-password');
    res.status(200).json({ success: true, data: deliveryBoys });
  } catch (err) {
    next(err);
  }
};

// @desc    Update delivery status
// @route   PUT /api/delivery/status
// @access  Private/Delivery
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.user.id,
      { status },
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: delivery });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all delivery partners (for admin)
// @route   GET /api/delivery
// @access  Private/Admin
exports.getAllDeliveryPartners = async (req, res, next) => {
  try {
    const partners = await Delivery.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, data: partners });
  } catch (err) {
    next(err);
  }
};

// @desc    Update delivery approval status
// @route   PUT /api/delivery/:id/approve
// @access  Private/Admin
exports.updateDeliveryApprovalStatus = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body; // 'Approved' or 'Rejected'
    const partner = await Delivery.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true, runValidators: true }
    );

    if (!partner) return res.status(404).json({ success: false, error: 'Partner not found' });

    // Notify partner about approval status
    notifyDeliveryApproval(partner._id, {
      id: partner._id,
      status: approvalStatus,
      message: approvalStatus === 'Approved' 
        ? 'Congratulations! Your delivery partner account has been approved.' 
        : 'Your delivery partner account application has been rejected.'
    });

    res.status(200).json({ success: true, data: partner });
  } catch (err) {
    next(err);
  }
};
