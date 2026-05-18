const express = require('express');
const { registerUser, loginUser, getUserMe, updateUserProfile, verifyEmailOtp, resendVerificationOtp, forgotPassword, resetPassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { check } = require('express-validator');
const { validate } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post('/register', [
  check('fullName', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  validate
], registerUser);

router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  validate
], loginUser);
router.get('/me', protect, getUserMe);
router.put('/profile', protect, updateUserProfile);

router.post('/verify-email', verifyEmailOtp);
router.post('/resend-otp', resendVerificationOtp);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword', resetPassword);

module.exports = router;
