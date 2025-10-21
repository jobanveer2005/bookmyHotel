// routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware'); // Your auth middleware
const { getMe, updateDetails } = require('../controllers/userController');

// @route   GET api/user/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, getMe);

// @route   PUT api/user/update
// @desc    Update user details
// @access  Private
router.put('/update', auth, updateDetails);

module.exports = router;