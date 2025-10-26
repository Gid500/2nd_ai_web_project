import './Mypagetab.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './hook/useAuth';

function Mypagetab() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <div>
      <nav className="mypageTabs">
        <NavLink
          to="/mypage"
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          프로필 변경
        </NavLink>

        <NavLink
          to="/care"
          className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
        >
          계정 관리
        </NavLink>

        <button className="logoutBtn" onClick={handleLogout}>
          로그아웃
        </button>
      </nav>
    </div>
  );
}

export default Mypagetab;
