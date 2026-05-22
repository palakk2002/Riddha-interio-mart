const express = require('express');
const {
  createTicket,
  getSellerTickets,
  getTicketById,
  replyToTicket,
  updateTicketStatus,
  getAdminTickets
} = require('../controllers/supportController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Seller ticket routes
router.route('/tickets')
  .post(authorize('seller'), createTicket)
  .get(authorize('seller'), getSellerTickets);

// Shared ticket routes (both seller and admin can view details and reply)
router.route('/tickets/:id')
  .get(authorize('seller', 'admin'), getTicketById);

router.route('/tickets/:id/replies')
  .post(authorize('seller', 'admin'), replyToTicket);

// Admin-specific support routes
router.route('/admin/tickets')
  .get(authorize('admin'), getAdminTickets);

router.route('/admin/tickets/:id/status')
  .patch(authorize('admin'), updateTicketStatus);

module.exports = router;
