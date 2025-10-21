const Booking = require('../models/Booking');
const Room = require('../models/Room'); // Not used yet, but good to have
const User = require('../models/User'); // Not used yet, but good to have

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private
exports.createBooking = async (req, res) => {
    // 'roomId' here is the id_name like 'deluxe-king'
    const { roomId, checkInDate, checkOutDate, guests, totalPrice, roomName } = req.body;

    try {
        // req.user.id comes from your authMiddleware
        const newBooking = new Booking({
            user: req.user.id,
            room: roomId,
            roomName: roomName,
            checkInDate: new Date(checkInDate),
            checkOutDate: new Date(checkOutDate),
            guests: Number(guests),
            totalPrice: Number(totalPrice)
        });

        const booking = await newBooking.save();
        res.json(booking);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @route   GET api/bookings/mybookings
// @desc    Get all bookings for the logged-in user
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        // Find bookings and sort by the most recent check-in date
        const bookings = await Booking.find({ user: req.user.id })
                                      .sort({ checkInDate: -1 });
        res.json(bookings);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};