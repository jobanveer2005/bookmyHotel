# Hotel Booking System

A full-stack hotel booking application with React frontend and Node.js backend.

## 🏗️ Project Structure

```
hotel-booking-system/
├── bookmyHotel/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Pages/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Signup.jsx
│   │   │   │   ├── Booking.jsx
│   │   │   │   ├── ExploreRooms.jsx
│   │   │   │   └── ...
│   │   │   ├── Alert.jsx
│   │   │   ├── AlertProvider.jsx
│   │   │   └── Homepage.jsx
│   │   ├── config.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── SETUP.md
└── hotel-booking-backend/       # Backend (Node.js + Express)
    ├── api/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   ├── config/
    │   └── server.js
    ├── package.json
    └── SETUP.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git

### 1. Backend Setup

```bash
# Navigate to backend directory
cd hotel-booking-backend/api

# Install dependencies
npm install

# Create environment file
cp config/env.example .env

# Edit .env file with your configuration
# Set MONGO_URI, JWT_SECRET, etc.

# Start the server
npm start
# or for development with auto-restart
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd bookmyHotel

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🎯 Features

### Frontend Features
- ✅ **Responsive Design**: Mobile-first approach with Bootstrap 5
- ✅ **User Authentication**: Login, Signup, Password Reset
- ✅ **Room Exploration**: Browse available rooms with details
- ✅ **Booking System**: Create and manage reservations
- ✅ **User Profile**: Update personal information
- ✅ **Booking History**: View past bookings
- ✅ **Alert System**: User-friendly notifications
- ✅ **Smooth Animations**: Page transitions and hover effects

### Backend Features
- ✅ **RESTful API**: Well-structured endpoints
- ✅ **JWT Authentication**: Secure user sessions
- ✅ **MongoDB Integration**: Database operations
- ✅ **Password Reset**: Email-based recovery
- ✅ **Data Validation**: Input sanitization
- ✅ **CORS Support**: Cross-origin requests
- ✅ **Error Handling**: Comprehensive error management

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool
- **Bootstrap 5** - CSS framework
- **Custom CSS** - Enhanced styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `PUT /api/auth/reset-password/:token` - Reset password

### Rooms
- `GET /api/rooms` - Get all available rooms

### Bookings
- `POST /api/bookings` - Create new booking (auth required)
- `GET /api/bookings/mybookings` - Get user bookings (auth required)

### User
- `GET /api/user/me` - Get current user (auth required)
- `PUT /api/user/update` - Update user details (auth required)

## 🔧 Configuration

### Backend Environment Variables
```env
MONGO_URI=mongodb://127.0.0.1:27017/bookmyhotel
JWT_SECRET=your_super_secret_jwt_key_here
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASS=your_app_password_here
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Frontend Configuration
The frontend automatically connects to `http://localhost:5000` for the API. To change this, set the `VITE_API_BASE_URL` environment variable.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify MongoDB service is started

2. **CORS Issues**
   - Backend has CORS enabled by default
   - Check API_BASE_URL in frontend config

3. **Authentication Issues**
   - Verify JWT_SECRET is set in backend
   - Check token storage in localStorage

4. **Port Already in Use**
   - Change PORT in backend `.env`
   - Or kill the process using the port

## 📝 Development

### Backend Development
```bash
cd hotel-booking-backend/api
npm run dev  # Auto-restart on changes
```

### Frontend Development
```bash
cd bookmyHotel
npm run dev  # Hot reload enabled
```

### Building for Production
```bash
# Frontend
cd bookmyHotel
npm run build

# Backend
cd hotel-booking-backend/api
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
1. Check the setup guides in each directory
2. Review the troubleshooting section
3. Check the console for error messages
4. Ensure all dependencies are installed
5. Verify environment variables are set correctly

## 🎉 Success!

If everything is set up correctly, you should be able to:
- Visit http://localhost:3000 to see the frontend
- Register a new account
- Login with your credentials
- Explore available rooms
- Make a booking
- View your booking history
- Update your profile

The application is now fully functional! 🚀
