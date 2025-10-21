const express = require('express');
// REMOVED ../ from here:
const connectDB = require('./config/db'); 
const cors = require('cors');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow app to accept JSON data

// Define Routes
// REMOVED ../ from all of these:
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/user', require('./routes/user'));
app.use('/api/bookings', require('./routes/booking'));

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Export the app for Vercel
module.exports = app;