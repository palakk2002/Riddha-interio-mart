const express = require('express');
const { registerUser, loginUser, getUserMe, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserMe);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
