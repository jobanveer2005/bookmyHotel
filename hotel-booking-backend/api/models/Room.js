const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
    id_name: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    amenities: [{ type: String }],
});

module.exports = mongoose.model('room', RoomSchema);