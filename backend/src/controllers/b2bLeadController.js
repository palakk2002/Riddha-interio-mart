const B2BLead = require('../models/B2BLead');

// @desc    Create a new B2B Lead
// @route   POST /api/b2b-leads
// @access  Public
exports.createLead = async (req, res, next) => {
  try {
    const lead = await B2BLead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all B2B Leads
// @route   GET /api/b2b-leads
// @access  Private/Admin
exports.getLeads = async (req, res, next) => {
  try {
    const leads = await B2BLead.find().sort('-createdAt').lean();
    res.status(200).json({ success: true, data: leads });
  } catch (err) {
    next(err);
  }
};

// @desc    Update B2B Lead status
// @route   PUT /api/b2b-leads/:id/status
// @access  Private/Admin
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const lead = await B2BLead.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }
    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};
