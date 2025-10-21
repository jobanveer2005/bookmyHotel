import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthNavbar from '../AuthNavbar';
import { useAlert } from '../AlertProvider';
import { API_BASE_URL } from '../../config';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { success, error, warning } = useAlert();

    // In Login.jsx

async function handleSubmit(event) {
    event.preventDefault();
    if (!email || !password) {
        warning('Please enter email and password.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            // If response is not 2xx, throw an error to be caught by the catch block
            throw new Error(data.msg || 'Something went wrong');
        }

        // --- SUCCESS ---
        // Save the token and redirect
        localStorage.setItem('token', data.token);
        success(`Welcome back, ${email}!`);
        // You can use useNavigate() here to redirect the user to the homepage or dashboard
        // navigate('/'); 
        navigate('/explore');

    } catch (error) {
        console.error('Login Error:', error);
        error(error.message); // Show the specific error from the backend
    }
}

    // removed unused inline forgot-password handler; navigation link is used instead

    return (
        <div className="hero-section">
            <AuthNavbar />
            <div className="auth-wrapper">
                <div className="auth-card auth-card--elevated">
                <h2 className="auth-title">Welcome back</h2>
                <p className="auth-subtitle">Sign in to continue your booking</p>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="password">Password</label>
                    <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit" className="primary-btn">Login</button>
                </form>
                <div className="forgot-password">
                    <Link className="ghost-btn" to="/forgot-password">Forgot password</Link>
                </div>
                    <div className="auth-links auth-links--stacked">
                        <div>
                            <span>Don't have an account? </span>
                            <Link to="/signup">Create Account</Link>
                        </div>
                        <div>
                            <Link to="/">Back to home</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;