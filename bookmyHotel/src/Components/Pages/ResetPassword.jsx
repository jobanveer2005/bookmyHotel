import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AuthNavbar from '../AuthNavbar';
import { API_BASE_URL } from '../../config';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { token } = useParams(); // Gets the token from the URL
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-password/${token}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Failed to reset password.');
            }

            setMessage('Password has been reset successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000); // Redirect after 3 seconds

        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div className="hero-section">
            <AuthNavbar />
            <div className="auth-wrapper">
                <div className="auth-card auth-card--elevated">
                    <h2 className="auth-title">Reset Password</h2>
                    <p className="auth-subtitle">Enter your new password below</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label htmlFor="password">New Password</label>
                        <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                        <button type="submit" className="primary-btn">Reset Password</button>
                    </form>
                    {message && <p style={{ marginTop: '15px', color: 'lightgreen' }}>{message}</p>}
                    {error && <p style={{ marginTop: '15px', color: 'salmon' }}>{error}</p>}
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;