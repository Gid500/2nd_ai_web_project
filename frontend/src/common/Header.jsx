import './Header.css';
import { NavLink } from 'react-router-dom';

function Header() {
  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* 로고 */}
        <div className="flex items-center gap-3">
          <img
            src="/Group 24.svg"   // public/에 있는 SVG
            alt="명냥 로고"
            className="logo"
          />
        </div>

        {/* 탭 네비게이션 */}
        <nav className="tabs">
          <NavLink to="/" end className={({isActive}) => `tab ${isActive ? 'active' : ''}`}>
            궁금해요!
          </NavLink>
          <NavLink to="/home" className={({isActive}) => `tab ${isActive ? 'active' : ''}`}>
            자랑해요!
          </NavLink>
          <NavLink to="/mypage" className={({isActive}) => `tab ${isActive ? 'active' : ''}`}>
            사이트 소개
          </NavLink>
          
        </nav>
      </div>
    </header>
  );
}

export default Header;
