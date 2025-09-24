import React from 'react';
import { Link } from 'react-router-dom';
import '../../asset/css/Error.css'

function NotFound() {
    return (
        <div className="error-container">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <Link to="/" className="error-link">Go to Home</Link>
        </div>
    );
}

export default NotFound;
