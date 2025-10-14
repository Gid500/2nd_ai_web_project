import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../asset/css/Header.css'
import { useAuth } from '../context/AuthContext'; // useAuth 훅 import

function Header() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth(); // AuthContext에서 상태와 함수 가져오기

    const handleLogout = async () => {
        try {
            await logout(); // AuthContext의 logout 함수 호출
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
                    {isAuthenticated ? (
                        <>
                            <li><span>Welcome, {user?.id}</span></li>
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