import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './hook/useAuth';

function Header() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }) => `tab ${isActive ? 'active' : ''}`;

  const [open, setOpen] = useState(false);            // ▼ 드롭다운 열림 상태
  const menuRef = useRef(null);                       // 메뉴/버튼 래퍼
  const btnRef = useRef(null);


  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  const onProfileClick = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert('로그인 후 이용해주세요!');
      navigate('/signin');
      return;
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);


  return (
    <header>
      <div className="header">
        <div className="logo_area">
          <img
            src="/Group 24.svg"
            alt="명냥 로고"
            className="logo"
          />
        </div>

          <div className="nav">
            <nav className="tabs">
              <NavLink to="/" end className={getNavLinkClass}>궁금해요!</NavLink>
              <NavLink to="/comm" className={getNavLinkClass}>자랑해요!</NavLink>
              <NavLink to="/explain" className={getNavLinkClass}>사이트 소개</NavLink>
              <NavLink to="/map" className={getNavLinkClass}>주변 시설</NavLink>
            </nav>
          

           <nav className="login" ref={menuRef}>
  {/* 아이콘 버튼: 모양은 그대로, NavLink 대신 버튼 */}
  <button
    type="button"
    className="profile-btn"
    aria-haspopup="menu"
    aria-expanded={open}
    onClick={onProfileClick}
    title={isLoggedIn ? '마이페이지' : '로그인'}
  >
    <i className="fa-solid fa-user" />
  </button>

  {/* 로그인 상태에서만 드롭다운 표시 */}
  {isLoggedIn && open && (
    <div className="profile-menu" role="menu">
      <button
        className="menu-item"
        role="menuitem"
        onClick={() => {
          setOpen(false);
          navigate('/mypage');
        }}
      >
        마이페이지
      </button>
      <div className="menu-sep" />
      <button
        className="menu-item danger"
        role="menuitem"
        onClick={handleLogout}
        
      >
        로그아웃
      </button>
      <div className="menu-caret" aria-hidden="true" />
    </div>
  )}

  {/* 비로그인: 아이콘 클릭 시 안내 후 /signin 이동 */}
  {!isLoggedIn && open && null}
</nav>
        </div>
      </div>
      
    </header>
  );
}

export default Header;
