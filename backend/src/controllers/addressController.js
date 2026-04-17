const Address = require('../models/Address');

// @desc    Get user addresses
// @route   GET /api/address
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort('-isDefault -createdAt');

    res.status(200).json({
      success: true,
      data: addresses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new address
// @route   POST /api/address
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const { isDefault } = req.body;

    // If this is set as default, unset other default addresses for this user
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      ...req.body,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/address/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    let address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Make sure user owns address
    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const { isDefault } = req.body;
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: address
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/address/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Make sure user owns address
    if (address.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    await address.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Address removed'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
