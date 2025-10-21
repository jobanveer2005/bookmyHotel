import React from 'react';
import { Link } from 'react-router-dom';

function AuthNavbar() {
    return (
        <header className="auth-navbar">
            <div className="auth-navbar__inner">
                <Link to="/" className="auth-brand">
                    <span className="auth-brand__text">BookMyHotel</span>
                </Link>
                <Link to="/" className="btn btn-outline-light btn-sm ms-auto">Back to home</Link>
            </div>
        </header>
    );
}

export default AuthNavbar;


