import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthNavbar from '../AuthNavbar';
import { useAlert } from '../AlertProvider';
import { API_BASE_URL } from '../../config';

function ExploreRooms() {
    const navigate = useNavigate();
    const { error } = useAlert();

    // State to hold the room data fetched from the API
    const [rooms, setRooms] = useState([]);
    // State to handle the loading message while data is being fetched
    const [loading, setLoading] = useState(true);

    // This effect runs once when the component is first rendered
    useEffect(() => {
        // We define an async function to fetch the room data
        const fetchRooms = async () => {
            try {
                // Make the API call to your backend endpoint
                const response = await fetch(`${API_BASE_URL}/api/rooms`);
                const data = await response.json();

                // Update the 'rooms' state with the data from the backend
                setRooms(data);

            } catch (error) {
                console.error("Failed to fetch rooms:", error);
                error("Could not load room data. Please try again later.");
            } finally {
                // This runs after the fetch is finished, whether it succeeded or failed
                // Set loading to false because the process is complete
                setLoading(false);
            }
        };

        fetchRooms(); // Call the function to start the process
    }, []); // The empty array ensures this effect runs only once on component mount

    // If data is still being fetched, show a loading message
    if (loading) {
        return (
            <div className="explore-bg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h1>Loading Rooms...</h1>
            </div>
        );
    }

    // Once loading is false, show the main content with the fetched data
    return (
        <div className="explore-bg">
            <AuthNavbar />
            <div className="container py-4">
                <h1 className="mb-4 text-center">Explore Rooms</h1>
                <div className="row g-3">
                    {/* Map over the 'rooms' state variable to create a card for each room */}
                    {rooms.map((room) => (
                        // Use MongoDB's unique '_id' for the key prop
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={room._id}>
                            <div className="card h-100 shadow-sm">
                                <img src={room.img} className="card-img-top" alt={room.name} />
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-1 small text-body-secondary">{room.location}</div>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h5 className="card-title mb-0">{room.name}</h5>
                                        <div className="text-nowrap">
                                            <span className="fw-bold">${room.pricePerNight}</span>
                                            <small className="text-body-secondary">/night</small>
                                        </div>
                                    </div>
                                    <p className="card-text flex-grow-0">{room.description}</p>
                                    <ul className="mb-3 ps-3 small">
                                        {room.amenities.map((a) => (
                                            <li key={a}>{a}</li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto d-flex gap-2">
                                        <button className="btn btn-primary" onClick={() => navigate('/booking')}>Book Now</button>
                                        <button className="btn btn-outline-secondary" onClick={() => navigate('/login')}>Login</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ExploreRooms;