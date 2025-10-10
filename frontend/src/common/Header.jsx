import React from 'react';
import { Link } from 'react-router-dom';
import '../asset/css/Header.css'

function Header() {
    return (
        <header className="header-container">
            <div className="header-logo">
                <Link to="/">Home</Link>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/posts">Posts</Link></li>
                    <li><Link to="/signup">SignUp</Link></li>
                    <li><Link to="/signin">SignIn</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;