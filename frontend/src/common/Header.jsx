import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api/axios';
import '../asset/css/Header.css';

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
          setUserId(response.data.split(": ")[1]);
        } else {
          setIsLoggedIn(false);
          setUserId(null);
        }
      } catch {
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
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Link to="/">REIVA</Link>
        </div>
        <div className="auth-btn">
          {isLoggedIn ? (
            <>
              <span className="welcome">안녕하세요, {userId}님</span>
              <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate('/signin')}>로그인</button>
          )}
        </div>
      </div>

      <nav className="nav">
        <ul className="main-menu">
          <li><Link to="/">원피스</Link></li>
          <li><Link to="/top">상의</Link></li>
          <li><Link to="/bottom">하의</Link></li>
          <li><Link to="/about">사이트 소개</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
