const express = require('express');
const {
  register,
  verifyOtp,
  login,
  verifyLoginOtp,
  googleLogin,
  facebookLogin,
  getMe,
  logout,
  resendOtp,
  clerkSocialLogin   // ⭐ NEW (import controller)
} = require('../controllers/AuthController');                   



const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/verify-login-otp', verifyLoginOtp);
router.post('/google', googleLogin);
router.post('/facebook', facebookLogin);
router.post('/resend-otp', resendOtp);

// ⭐ NEW Clerk Social Login route
router.post("/clerk-social-login", clerkSocialLogin);



// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
