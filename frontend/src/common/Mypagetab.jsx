import './Mypagetab.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './hook/useAuth';

function Mypagetab() {
  const { logout } = useAuth();
  const navigate = useNavigate();


  return (
    <div>
      <nav className="mypage-tabs">
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


      </nav>
    </div>
  );
}

export default Mypagetab;
