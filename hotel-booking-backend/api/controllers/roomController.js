const Room = require('../models/Room');

// This is the same data from your frontend, now ready to be served from the DB.
const roomSeedData = [
    {
        id_name: 'deluxe-king', name: 'Deluxe King Room', pricePerNight: 149,
        img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop',
        description: 'Spacious king bed, city view, complimentary breakfast.', location: 'Mumbai, India',
        amenities: ['King bed', 'Ensuite bath', 'Free Wi-Fi', 'Breakfast included']
    },
    {
        id_name: 'suite-sea', name: 'Executive Suite', pricePerNight: 249,
        img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1600&auto=format&fit=crop',
        description: 'Separate living area with panoramic view and workspace.', location: 'Goa, India',
        amenities: ['King bed', 'Living area', 'Premium toiletries', 'Workspace']
    },
    {
        id_name: 'twin-standard', name: 'Standard Twin', pricePerNight: 109,
        img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1600&auto=format&fit=crop',
        description: 'Comfortable twin beds perfect for friends or colleagues.', location: 'Bengaluru, India',
        amenities: ['2 Twin beds', 'Shower', 'Free Wi-Fi', '42" TV']
    },
    {
        id_name: 'family-suite', name: 'Family Suite', pricePerNight: 199,
        img: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1600&auto=format&fit=crop',
        description: 'Two-bedroom suite ideal for families with kids.', location: 'Jaipur, India',
        amenities: ['2 Bedrooms', 'Sofa bed', 'Kitchenette', 'Crib on request']
    }
];

// Helper function to seed the database with initial room data
const seedRooms = async () => {
    try {
        await Room.deleteMany({}); // Clear existing rooms
        await Room.insertMany(roomSeedData);
        console.log('Room data has been seeded!');
    } catch (err) {
        console.error('Error seeding rooms:', err.message);
    }
};

// @route   GET api/rooms
// @desc    Get all rooms
exports.getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        // If the rooms collection is empty, seed it.
        if (rooms.length === 0) {
            await seedRooms();
            const seededRooms = await Room.find();
            return res.json(seededRooms);
        }
        res.json(rooms);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};