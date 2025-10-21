# Hotel Booking Backend Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v4.4 or higher)
3. **Git** (for version control)

## Installation Steps

### 1. Install MongoDB

#### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Make sure to install MongoDB as a Windows Service
4. Start MongoDB service

#### Alternative - Using MongoDB Atlas (Cloud):
- Sign up at https://www.mongodb.com/atlas
- Create a free cluster
- Get your connection string

### 2. Environment Setup

1. Copy the environment example file:
   ```bash
   cp config/env.example .env
   ```

2. Edit the `.env` file with your configuration:
   ```env
   # Database Configuration
   MONGO_URI=mongodb://127.0.0.1:27017/bookmyhotel
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/bookmyhotel

   # JWT Secret (change this to a secure random string)
   JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

   # Email Configuration (for password reset)
   GMAIL_USER=your_email@gmail.com
   GMAIL_APP_PASS=your_app_password_here

   # Frontend URL (for password reset links)
   FRONTEND_URL=http://localhost:3000

   # Server Port
   PORT=5000
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

- `GET /` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `PUT /api/auth/reset-password/:token` - Reset password
- `GET /api/rooms` - Get all rooms
- `POST /api/bookings` - Create booking (requires auth)
- `GET /api/bookings/mybookings` - Get user bookings (requires auth)
- `GET /api/user/me` - Get current user (requires auth)
- `PUT /api/user/update` - Update user details (requires auth)

## Testing the API

You can test the API using:
- Postman
- curl
- Frontend application

Example registration:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify MongoDB service is started

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using the port

### JWT Secret Issues
- Make sure JWT_SECRET is set in `.env`
- Use a strong, random secret key
