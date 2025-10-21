const express = require('express');
const router = express.Router();
const { getRooms } = require('../controllers/roomController');

// @route   GET api/rooms
// @desc    Get all rooms
router.get('/', getRooms);

module.exports = router;