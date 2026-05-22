const SupportTicket = require('../models/SupportTicket');
const paginate = require('../utils/paginate');

// @desc    Create a new support ticket
// @route   POST /api/support/tickets
// @access  Private (Seller)
exports.createTicket = async (req, res) => {
  try {
    const { subject, category, priority, description, attachments } = req.body;

    if (!subject || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, category, and description.'
      });
    }

    const ticket = await SupportTicket.create({
      seller: req.user._id,
      subject,
      category,
      priority: priority || 'Low',
      description,
      attachments: attachments || [],
      status: 'Open'
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get tickets for logged-in seller
// @route   GET /api/support/tickets
// @access  Private (Seller)
exports.getSellerTickets = async (req, res) => {
  try {
    const query = { seller: req.user._id };

    // Support filters if provided in query params
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    const populateOptions = []; // No mandatory populations, but we can return basic seller details if needed
    const result = await paginate(SupportTicket, query, req, populateOptions);

    res.status(200).json({
      success: true,
      count: result.data.length,
      totalResults: result.totalResults,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single ticket details
// @route   GET /api/support/tickets/:id
// @access  Private (Seller/Admin)
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('seller', 'businessName ownerName email phoneNumber')
      .populate({
        path: 'replies.sender',
        select: 'fullName email businessName ownerName'
      });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role-based protection: Seller can only see their own tickets
    if (req.user.role === 'seller' && ticket.seller._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this ticket'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reply to an ongoing ticket thread
// @route   POST /api/support/tickets/:id/replies
// @access  Private (Seller/Admin)
exports.replyToTicket = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ success: false, message: 'Reply text cannot be empty' });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Role-based protection: Seller can only reply to their own tickets
    if (req.user.role === 'seller' && ticket.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to reply to this ticket'
      });
    }

    const senderModel = req.user.role === 'admin' ? 'Admin' : 'Seller';

    ticket.replies.push({
      sender: req.user._id,
      senderModel,
      text
    });

    // Smart status transition: 
    // - If seller replies to Closed or Resolved ticket, reopen it.
    // - If admin replies, set status to In Progress to indicate it is actively handled.
    if (req.user.role === 'seller') {
      if (ticket.status === 'Closed' || ticket.status === 'Resolved') {
        ticket.status = 'Open';
      }
    } else if (req.user.role === 'admin') {
      if (ticket.status === 'Open') {
        ticket.status = 'In Progress';
      }
    }

    await ticket.save();

    // Populate replies for immediate frontend rendering
    const updatedTicket = await SupportTicket.findById(ticket._id)
      .populate({
        path: 'replies.sender',
        select: 'fullName email businessName ownerName'
      });

    res.status(200).json({
      success: true,
      message: 'Reply added successfully',
      data: updatedTicket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update support ticket status
// @route   PATCH /api/support/admin/tickets/:id/status
// @access  Private (Admin)
exports.updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Please provide a valid status: ${validStatuses.join(', ')}`
      });
    }

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({
      success: true,
      message: `Ticket status updated to ${status}`,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all merchant tickets (Admin support dashboard)
// @route   GET /api/support/admin/tickets
// @access  Private (Admin)
exports.getAdminTickets = async (req, res) => {
  try {
    const query = {};

    // Support filters
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.category) {
      query.category = req.query.category;
    }
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    if (req.query.sellerId) {
      query.seller = req.query.sellerId;
    }

    const populateOptions = { path: 'seller', select: 'businessName ownerName email' };
    const result = await paginate(SupportTicket, query, req, populateOptions);

    res.status(200).json({
      success: true,
      count: result.data.length,
      totalResults: result.totalResults,
      totalPages: result.totalPages,
      page: result.page,
      limit: result.limit,
      data: result.data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
