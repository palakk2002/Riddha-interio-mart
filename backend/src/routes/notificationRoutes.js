const express = require('express');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} = require('../controllers/notificationController');
const {
  registerFCMToken,
  revokeFCMToken
} = require('../controllers/fcmTokenController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // All routes require authentication

router.route('/')
  .get(getNotifications);

router.put('/read-all', markAllAsRead);
router.delete('/clear-all', clearAllNotifications);

// FCM Device Token Management
router.post('/fcm-token', registerFCMToken);
router.delete('/fcm-token', revokeFCMToken);

router.route('/:id/read')
  .put(markAsRead);

router.route('/:id')
  .delete(deleteNotification);

module.exports = router;
