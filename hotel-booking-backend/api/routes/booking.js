const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createBooking, getMyBookings } = require('../controllers/bookingController');

// POST /api/bookings - Create a new booking
router.post('/', auth, createBooking);

// GET /api/bookings/mybookings - Get user's booking history
router.get('/mybookings', auth, getMyBookings);

module.exports = router;