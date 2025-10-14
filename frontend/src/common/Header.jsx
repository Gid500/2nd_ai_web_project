import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api/axios';
import '../asset/css/Header.css'

function Header() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await api.get('/api/checkSession');
                if (response.status === 200 && response.data.startsWith("세션 유효")) {
                    setIsLoggedIn(true);
                    setUserId(response.data.split(": ")[1]); // "세션 유효: userId" 에서 userId 추출
                } else {
                    setIsLoggedIn(false);
                    setUserId(null);
                }
            } catch (error) {
                setIsLoggedIn(false);
                setUserId(null);
            }
        };
        checkSession();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post('/api/logout');
            setIsLoggedIn(false);
            setUserId(null);
            navigate('/signin');
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <header className="header-container">
            <div className="header-logo">
                <Link to="/">Home</Link>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><Link to="/posts">Posts</Link></li>
                    {isLoggedIn ? (
                        <>
                            <li><span>Welcome, {userId}</span></li>
                            <li><button onClick={handleLogout} className="text-btn">Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/signup">SignUp</Link></li>
                            <li><Link to="/signin">SignIn</Link></li>
                        </>
                    )}
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;