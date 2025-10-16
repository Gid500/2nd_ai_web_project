import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../asset/css/Header.css';

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, roleType } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <header className="header">
      <div className="header-top">
        <div className="logo">
          <Link to="About">REVIA</Link>
        </div>
        <div className="auth-btn">
          {isAuthenticated ? (
            <>
              <span className="welcome">안녕하세요, {user?.userId}님</span>
              <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
              {roleType === 'admin' && (
                <Link to="/admin" className="admin-btn">관리자 페이지</Link>
              )}
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate('/signin')}>로그인</button>
          )}
        </div>
      </div>

      <nav className="nav">
        <ul className="main-menu">
          <li><Link to="/category/onepiece">원피스</Link></li>
          <li><Link to="/category/top">상의</Link></li>
          <li><Link to="/category/bottom">하의</Link></li>
          <li><Link to="/STYLE">스타일</Link></li>
          <li><Link to="/bottom">고객센터</Link></li>
          <li><Link to="/my">마이페이지</Link></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
