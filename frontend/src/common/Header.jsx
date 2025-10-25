import './Header.css';
import { NavLink, useNavigate } from 'react-router-dom'; // useNavigate 임포트
import { useAuth } from './hook/useAuth'; // useAuth 훅 임포트


function Header() {
  const { isLoggedIn, isAdmin, logout } = useAuth(); // useAuth 훅 사용
  const navigate = useNavigate(); // useNavigate 훅 사용

  const goSignin = (e) => {
  e.preventDefault();                 // NavLink의 기본 이동 막기
  alert('로그인 후 이용해주세요!');     // 알림
  navigate('/signin');                // 확인 후 이동
};

  // NavLink의 className을 동적으로 생성하는 헬퍼 함수
  const getNavLinkClass = ({ isActive }) => `tab ${isActive ? 'active' : ''}`;

  const handleLogout = () => {
    logout(); // 로그아웃 처리
    navigate('/'); // 로그아웃 후 메인 페이지로 이동
  };

  return (
    <header>
      <div className="header">
        {/* 로고 */}
        <div className="logo_area">
          <img
            src="/Group 24.svg"   // public/에 있는 SVG
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
              <NavLink to="/mypage" className="profile"><i className="fa-solid fa-user"></i></NavLink>
            ) : (
              <NavLink to="/signin" className="profile" onClick={goSignin}><i className="fa-solid fa-user"></i></NavLink>
            )}
          </nav>
        </div>
      </div>
      
    </header>
  );
}

export default Header;
