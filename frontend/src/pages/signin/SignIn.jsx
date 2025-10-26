import React, { useEffect } from 'react';
import useInput from '../../common/hook/useInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hook/AuthProvider'; // AuthProvider에서 useAuth 임포트
import api from '../../common/api/api'; // api 인스턴스 임포트
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { NavLink } from 'react-router-dom';
import './SignIn.css'; // Import SignIn.css

function SignIn() {
    const getNavLinkClass = ({ isActive }) => `tab ${isActive ? 'active' : ''}`;
    const identifier = useInput('');
    const password = useInput('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const { login } = useAuth(); // useAuth 훅에서 login 함수 가져오기

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/login', {
                identifier: identifier.value,
                userPwd: password.value,
            });
            if (response.status === 200) {
                alert('로그인 성공!');
                login(); // 로그인 성공 시 AuthContext의 login 함수 호출
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data || err.message);
            alert('로그인 실패: ' + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form-card">
                <h2 className="signin-title">로그인</h2>
                <form onSubmit={handleLogin}>
                    <div className="pf-row">
                        <label className="pf-label">아이디 또는 이메일:</label>
                        <input type="text" className="pf-input" {...identifier} required />
                    </div>
                    <div className="pf-row">
                        <label className="pf-label">비밀번호:</label>
                        <input type="password" className="pf-input" {...password} required />
                    </div>
                    {error && <div className="signin-error">{error}</div>}
                    <button type="submit" className="pf-submit" disabled={loading}>
                        {loading ? <><LoadingSpinner /> <span style={{ marginLeft: '8px' }}>로그인 중...</span></> : '로그인'}
                    </button>
                </form>
                <nav className="signin-links">
                    <NavLink to="/signup" className={getNavLinkClass}>
                        회원 가입
                    </NavLink>
                </nav>
            </div>
        </div>
    );
}

export default SignIn;