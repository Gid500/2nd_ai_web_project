import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './hook/useAuth';

function Header() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const getNavLinkClass = ({ isActive }) => `tab ${isActive ? 'active' : ''}`;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            </nav>
          

            <nav className="login">
            {isAdmin && <NavLink to="/admin" className={getNavLinkClass}>관리자</NavLink>}
            {isLoggedIn ? (
              <>
                <NavLink to="/mypage" className="profile"><i className="fa-solid fa-user"></i></NavLink>
                <button onClick={handleLogout} className="logout-button">로그아웃</button>
              </>
            ) : (
              <NavLink to="/signin" className="profile"><i className="fa-solid fa-user"></i></NavLink>
            )}
          </nav>
        </div>
      </div>
      
    </header>
  );
}

export default Header;
