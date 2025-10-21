# Hotel Booking Frontend Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Backend API** running on `http://localhost:5000`

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

The frontend is configured to connect to the backend API. The API base URL is set in `src/config.js`:

```javascript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
```

To use a different backend URL, create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

## Features

- **Homepage**: Landing page with navigation
- **Authentication**: Login, Signup, Password Reset
- **Room Exploration**: Browse available rooms
- **Booking System**: Make hotel reservations
- **User Profile**: Update user information
- **Booking History**: View past bookings

## Project Structure

```
src/
├── Components/
│   ├── Pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Booking.jsx
│   │   ├── ExploreRooms.jsx
│   │   └── ...
│   ├── Alert.jsx
│   ├── AlertProvider.jsx
│   └── ...
├── config.js
├── App.jsx
├── main.jsx
└── index.css
```

## Key Components

### Authentication
- **Login**: User authentication with JWT tokens
- **Signup**: New user registration
- **Password Reset**: Email-based password recovery

### Room Management
- **Explore Rooms**: Display available rooms from backend
- **Room Details**: Show amenities, pricing, and descriptions

### Booking System
- **Booking Form**: Create new reservations
- **Booking History**: View past bookings
- **User Profile**: Manage user information

## API Integration

The frontend communicates with the backend through REST API calls:

- Authentication endpoints for login/signup
- Room endpoints for fetching room data
- Booking endpoints for creating and retrieving bookings
- User endpoints for profile management

## Styling

The application uses:
- **Bootstrap 5** for responsive design
- **Custom CSS** for enhanced styling
- **CSS Grid/Flexbox** for layouts
- **CSS Animations** for smooth transitions

## Troubleshooting

### CORS Issues
- Ensure backend has CORS enabled
- Check API_BASE_URL configuration

### Authentication Issues
- Verify JWT token is being stored in localStorage
- Check backend JWT_SECRET configuration

### Build Issues
- Clear node_modules and reinstall dependencies
- Check for version conflicts

### Styling Issues
- Ensure Bootstrap CSS is loaded
- Check custom CSS file is imported
