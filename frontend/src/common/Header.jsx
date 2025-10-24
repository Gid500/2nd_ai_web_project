import './Header.css';
import { NavLink } from 'react-router-dom';
import { useAuth } from './hook/useAuth'; // useAuth 훅 임포트

function Header() {
  const { isLoggedIn, logout } = useAuth(); // useAuth 훅 사용

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
          {isLoggedIn ? (
            <button onClick={logout} className="tab">로그아웃</button>
          ) : (
            <NavLink to="/signin" className={({isActive}) => `tab ${isActive ? 'active' : ''}`}>
              로그인
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
