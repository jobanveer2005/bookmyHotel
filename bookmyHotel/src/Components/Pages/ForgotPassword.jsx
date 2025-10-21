import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthNavbar from '../AuthNavbar';
import { API_BASE_URL } from '../../config';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(''); 

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage('');
        setError(''); 

        if (!email) {
            alert('Please enter your email.');
            return;
        }

        try {
            // 1. Store the server's response
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // 2. Check if the response status is NOT successful (e.g., 400 or 500)
            if (!response.ok) {
                const errorData = await response.json();
                // Throw an error to be caught by the catch block
                throw new Error(errorData.msg || 'An unexpected error occurred.');
            }

            // 3. Only if the response was successful, set the success message
            const data = await response.json(); // Get the success message
            setMessage(data.msg || 'If an account with that email exists, a password reset link has been sent.');

        } catch (err) {
            // This now catches both network errors and server errors
            setError(err.message);
        }
    }

    return (
        <div className="hero-section">
            <AuthNavbar />
            <div className="auth-wrapper">
                <div className="auth-card auth-card--elevated">
                    <h2 className="auth-title">Forgot Password</h2>
                    <p className="auth-subtitle">Enter your email to receive a reset link</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <button type="submit" className="primary-btn">Send Reset Link</button>
                    </form>

                    {/* Display feedback messages */}
                    {message && <p style={{ marginTop: '15px', color: 'lightgreen' }}>{message}</p>}
                    {error && <p style={{ marginTop: '15px', color: 'salmon' }}>{error}</p>}

                    <div className="auth-links auth-links--stacked">
                        <Link to="/login">Back to login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;