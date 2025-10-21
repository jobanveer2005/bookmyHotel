import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthNavbar from '../AuthNavbar';
import { useAlert } from '../AlertProvider';
import { API_BASE_URL } from '../../config';

function Signup() {
    // State variables to hold the form data
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Initialize the navigate function for redirection
    const navigate = useNavigate();
    const { success, error, warning } = useAlert();

    // This function runs when the user submits the form
    async function handleSubmit(event) {
        // Stop the default form action (which is to refresh the page)
        event.preventDefault();

        // Basic validation
        if (!name || !email || !password) {
            warning('Please fill out all fields.');
            return;
        }

        try {
            // Send the user's data to your backend's register endpoint
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            // If the server sends an error (e.g., "User already exists")
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to create account.');
            }

            // --- SUCCESS! ---
            // Save the token that the server sends back
            localStorage.setItem('token', data.token);

            success('Account created successfully! Welcome!');

            // Redirect the user to the explore rooms page
            navigate('/explore');

        } catch (error) {
            // If anything in the 'try' block fails, show the error message
            console.error('Signup Error:', error);
            error(error.message);
        }
    }

    // JSX for the component's UI
    return (
        <div className="hero-section">
            <AuthNavbar />
            <div className="auth-wrapper">
                <div className="auth-card auth-card--elevated">
                    <h2 className="auth-title">Create an Account</h2>
                    <p className="auth-subtitle">Start your journey with us</p>

                    {/* Attach the handleSubmit function to the form's onSubmit event */}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label htmlFor="name">Full Name</label>
                        {/* Link each input to its state variable and update it on change */}
                        <input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />

                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button type="submit" className="primary-btn">Create Account</button>
                    </form>

                    <div className="auth-links auth-links--stacked" style={{ marginTop: '16px' }}>
                        <div>
                            <span>Already have an account? </span>
                            <Link to="/login">Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;