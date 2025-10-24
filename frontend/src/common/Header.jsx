import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { useAuth } from './hook/useAuth'; // useAuth 훅 임포트

function Header() {
  const { isLoggedIn, isAdmin, logout } = useAuth(); // useAuth 훅 사용
  const navigate = useNavigate(); // useNavigate 훅 사용

  // NavLink의 className을 동적으로 생성하는 헬퍼 함수
  const getNavLinkClass = ({ isActive }) => `tab ${isActive ? 'active' : ''}`;

  const handleLogout = () => {
    logout(); // 로그아웃 처리
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

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
          <NavLink to="/" end className={getNavLinkClass}>
            궁금해요!
          </NavLink>
          <NavLink to="/home" className={getNavLinkClass}>
            자랑해요!
          </NavLink>
          <NavLink to="/mypage" className={getNavLinkClass}>
            사이트 소개
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={getNavLinkClass}>
              관리자
            </NavLink>
          )}
          {isLoggedIn ? (
            <button onClick={handleLogout} className="tab">로그아웃</button>
          ) : (
            <>
              <NavLink to="/signin" className={getNavLinkClass}>
                로그인
              </NavLink>
              <NavLink to="/signup" className={getNavLinkClass}>
                회원 가입
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
