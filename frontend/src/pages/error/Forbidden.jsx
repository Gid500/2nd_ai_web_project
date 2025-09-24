import React from 'react';
import { Link } from 'react-router-dom';
import '../../asset/css/Error.css'

function Forbidden() {
    return (
        <div className="error-container">
            <h1>403</h1>
            <h2>Forbidden</h2>
            <p>You do not have permission to access this page.</p>
            <Link to="/" className="error-link">Go to Home</Link>
        </div>
    );
}

export default Forbidden;
