const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPassword, resetPasswordPage } = require('../controllers/authController');

// @route   POST api/auth/register
// @desc    Register a user
router.post('/register', register);
router.post('/login', login);

// @route   POST api/auth/forgot-password
// @desc    Send a password reset link to the user's email
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.get('/reset-password/:resetToken', resetPasswordPage);

module.exports = router;