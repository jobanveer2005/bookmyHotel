import React, { useState} from "react";
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../AuthNavbar'; // You can add this back if you want
import { API_BASE_URL } from "../../config";
import { useAlert } from '../AlertProvider';

function Booking() {
  const navigate = useNavigate();
  const { success, error, warning } = useAlert();
  //const [token] = useState(localStorage.getItem('token'));

  // State for form fields
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);
  
  // A simple hard-coded map for price calculation
  const roomPrices = {
    'deluxe-king': 149,
    'suite-sea': 249,
    'twin-standard': 109,
    'family-suite': 199,
  };


  // Handle room selection change
  const handleRoomChange = (e) => {
    const selectedId = e.target.value;
    const selectedName = e.target.options[e.target.selectedIndex].text;
    setRoomId(selectedId);
    setRoomName(selectedName);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- NEW: Get token from localStorage right now ---
    const token = localStorage.getItem('token');

    // --- NEW: Check for token right now ---
    if (!token) {
      warning('You must be logged in to make a booking.');
      navigate('/login');
      return;
    }

    if (!roomId || !checkInDate || !checkOutDate || !guests) {
      warning('Please fill out all fields.');
      return;
    }
    
    // Simple price calculation
    const pricePerNight = roomPrices[roomId] || 0;
    const nights = (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24);
    
    if (nights <= 0) {
      warning('Check-out date must be after the check-in date.');
      return;
    }
    
    const totalPrice = pricePerNight * nights;

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send the token we just got
        },
        body: JSON.stringify({
          roomId, 
          roomName,
          checkInDate,
          checkOutDate,
          guests,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to create booking.');
      }

      // Success!
      success(`Booking successful! Your total is $${totalPrice} for ${nights} night(s).`);
      navigate('/'); // Redirect to homepage after booking

    } catch (error) {
      console.error('Booking Error:', error);
      error(error.message);
    }
  };

  return (
    <div
      className="booking-page"
      style={{
        backgroundColor: "grey",
        minHeight: "100vh",
        paddingTop: "5rem",
        paddingBottom: "2rem",
      }}
    >
      {/* <AuthNavbar /> */}
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div
              className="card shadow-lg"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(8px)",
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              <div className="card-body p-4 p-md-5">
                <h1 className="card-title text-center mb-4">Book Your Stay</h1>
                {/* Use the new handleSubmit function */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="roomType" className="form-label">
                      Room Type
                    </label>
                    <select
                      className="form-select"
                      id="roomType"
                      value={roomId}
                      onChange={handleRoomChange}
                      required
                    >
                      <option value="">Select a room...</option>
                      {/* These values must match the id_name in your backend seed data */}
                      <option value="deluxe-king">Deluxe King Room</option>
                      <option value="suite-sea">Executive Suite</option>
                      <option value="twin-standard">Standard Twin</option>
                      <option value="family-suite">Family Suite</option>
                    </select>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="checkin" className="form-label">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="checkin"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="checkout" className="form-label">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="checkout"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="guests" className="form-label">
                      Number of Guests
                    </label>
                    <select
                      className="form-select"
                      id="guests"
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      required
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-info w-100 py-2">
                    Book Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;