import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config"; // Import the config
import { useAlert } from './AlertProvider';

function Homepage() {
  const navigate = useNavigate();
  const { success, error, warning } = useAlert();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const [customer, setCustomer] = useState({
    name: "Guest",
    email: "Please log in",
    phone: "",
  });
  
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // === NEW STATE FOR MENU ===
  // This replaces 'activeSetting', 'showCustomer', and 'showSettings'
  // 'main' = main nav list
  // 'profile' = update profile form
  // 'history' = booking history list
  const [offcanvasView, setOffcanvasView] = useState("main");
  
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(false);


  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoggedIn(false);
          return;
        }

        try {
          // USE CONFIG VARIABLE
          const response = await fetch(`${API_BASE_URL}/api/user/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch user data.');
          }

          const data = await response.json();
          setCustomer(data);
          setProfileForm(data); // Pre-fill form state

        } catch (error) {
          console.error(error.message);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
          setCustomer({ name: "Guest", email: "Please log in", phone: "" });
        }
      };

      fetchUserData();
    }
  }, [isLoggedIn]);

  // This effect now runs when the user *clicks* to the history view
  useEffect(() => {
    if (offcanvasView === "history" && isLoggedIn) {
      const fetchBookings = async () => {
        setBookingLoading(true);
        const token = localStorage.getItem('token');
        
        try {
          // USE CONFIG VARIABLE
          const response = await fetch(`${API_BASE_URL}/api/bookings/mybookings`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-token': token,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to fetch bookings.');
          }

          const data = await response.json();
          setBookings(data);

        } catch (error) {
          console.error(error.message);
          setBookings([]);
        } finally {
          setBookingLoading(false);
        }
      };

      fetchBookings();
    }
  }, [offcanvasView, isLoggedIn]); // Re-run when view changes

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleProfileSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      warning('You must be logged in to save changes.');
      return;
    }

    try {
      const body = JSON.stringify({
        name: profileForm.name,
        phone: profileForm.phone
      });
      
      // USE CONFIG VARIABLE
      const response = await fetch(`${API_BASE_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: body,
      });
      
      const updatedUser = await response.json();
      
      if (!response.ok) {
        throw new Error(updatedUser.msg || 'Failed to save changes.');
      }

      setCustomer(updatedUser);
      success("Changes have been saved successfully!");
      setOffcanvasView("main"); // Go back to main menu

    } catch (error) {
      console.error('Save Error:', error);
      error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setCustomer({ name: "Guest", email: "Please log in", phone: "" });
    setOffcanvasView("main"); // Reset view on logout
    navigate('/');
  };

  // Helper function to render the correct view inside the offcanvas
  const renderOffcanvasContent = () => {
    switch (offcanvasView) {
      // --- Profile Update View ---
      case "profile":
        return (
          <div className="menu-sub-page">
            <div className="menu-sub-page-header">

              <button className="menu-back-btn" onClick={() => setOffcanvasView("main")}>
                <i className="bi bi-arrow-left"></i>
              </button>
              <h5>Update Profile</h5>
            </div>
            {/* Profile Form */}
            <div>
              <div className="mb-2">
                <label className="form-label small">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-2">
                <label className="form-label small">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Phone (e.g., +919876543210)"
                  value={profileForm.phone || ''}
                  onChange={handleProfileChange}
                />
              </div>
              <button
                className="btn btn-info w-100"
                onClick={handleProfileSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        );

      // --- Booking History View ---
      case "history":
        return (
          <div className="menu-sub-page">
            <div className="menu-sub-page-header">
              <button className="menu-back-btn" onClick={() => setOffcanvasView("main")}>
                <i className="bi bi-arrow-left"></i>
              </button>
              <h5>Booking History</h5>
            </div>
            {/* Booking List */}
            <div>
              {bookingLoading ? (
                <p>Loading history...</p>
              ) : bookings.length === 0 ? (
                <p className="mb-0 text-warning">
                  No bookings yet.
                </p>
              ) : (
                <ul className="menu-history-list">
                  {bookings.map(booking => (
                    <li key={booking._id} className="menu-history-item">
                      <strong className="d-block">{booking.roomName}</strong>
                      <small className="d-block">
                        Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
                      </small>
                      <small className="d-block">
                        Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}
                      </small>
                      <small className="d-block">
                        Price: ${booking.totalPrice}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        );

      // --- Main Menu View ---
      default:
        return (
          <>
            <div className="menu-profile-header">
              <h5>{customer.name}</h5>
              <p>{customer.email}</p>
            </div>
            <ul className="menu-nav-list">
              <li>
                <button
                  className="menu-nav-btn"
                  onClick={() => {
                    // Pre-fill form data when clicking update
                    setProfileForm(customer); 
                    setOffcanvasView("profile");
                  }}
                  disabled={!isLoggedIn}
                >
                  <i className="bi bi-person"></i>
                  Update Profile
                </button>
              </li>
              <li>
                <button
                  className="menu-nav-btn"
                  onClick={() => setOffcanvasView("history")}
                  disabled={!isLoggedIn}
                >
                  <i className="bi bi-clock-history"></i>
                  Booking History
                </button>
              </li>
              <li>
                <button
                  className="menu-nav-btn"
                  onClick={() => navigate('/explore')}
                >
                  <i className="bi bi-search"></i>
                  Explore Rooms
                </button>
              </li>
              <li>
                <button
                  className="menu-nav-btn"
                >
                  <i className="bi bi-question-circle"></i>
                  Help & Support
                </button>
              </li>
            </ul>
          </>
        );
    }
  };

  return (
    <div className="hero-section">
      {/* === TOP NAVBAR (Unchanged) === */}
      <nav className="navbar navbar-transparent fixed-top bg-body-tertiary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
          <img src="/bmH_1.png" alt="Logo" style={{ height: 40, marginRight: 8 }} />
             bookmyHotel
          </Link>
          <div className="d-flex align-items-center ms-auto">
            {isLoggedIn ? (
              <button
                className="btn btn-warning me-2"
                style={{ fontWeight: "500", letterSpacing: "0.5px" }}
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-left me-1"></i> Logout
              </button>
            ) : (
              <button
                className="btn btn-info me-2"
                style={{ fontWeight: "500", letterSpacing: "0.5px" }}
                onClick={() => navigate("/login")}
              >
                <i className="bi bi-box-arrow-in-right me-1"></i> Login
              </button>
            )}

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasNavbar"
              aria-controls="offcanvasNavbar"
              aria-label="Toggle navigation"
              onClick={() => setOffcanvasView('main')} // Reset view when opening
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
          
          {/* === START OF NEW OFFCANVAS MENU === */}
          <div
            className="offcanvas offcanvas-end menu-offcanvas" // Use new class
            tabIndex="-1"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
                onClick={() => setOffcanvasView('main')} // Reset view when closing
              ></button>
            </div>
            
            <div className="offcanvas-body">
              
              {/* This function renders the correct view */}
              {renderOffcanvasContent()}

              {/* Logout button at the bottom */}
              {isLoggedIn && (
                <div className="menu-footer">
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-left me-2"></i>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* === END OF NEW OFFCANVAS MENU === */}

        </div>
      </nav>

      {/* === HERO CONTENT (Unchanged) === */}
      <main
        className="main-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="hero-text" style={{ textAlign: "center" }}>
          <h1>Find your perfect stay</h1>
          <p>Luxury rooms, curated experiences, and seamless booking.</p>
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              marginTop: 16,
            }}
          >
            <button
              className="primary-btn"
              onClick={() => navigate("/booking")}
            >
              Book Now
            </button>
            <button className="ghost-btn" onClick={() => navigate("/explore")}>
              Explore Rooms
            </button>
          </div>
        </div>
      </main>

      {/* === FOOTER (Unchanged) === */}
      <footer
        className="footer-custom"
        style={{ padding: 16, textAlign: "center" }}
      >
        <small>
          © {new Date().getFullYear()} bookmyHotel. All rights reserved.
        </small>
      </footer>
    </div>
  );
}

export default Homepage;