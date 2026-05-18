const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getNotifications);

router.put('/read-all', markAllAsRead);

router.route('/:id/read')
  .put(markAsRead);

router.route('/:id')
  .delete(deleteNotification);

module.exports = router;
