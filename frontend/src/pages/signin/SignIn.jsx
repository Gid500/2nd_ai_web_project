import React from 'react';
import useInput from '../../common/hook/useInput';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hook/AuthProvider';
import api from '../../common/api/api';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import { NavLink } from 'react-router-dom';
import './SignIn.css';

function SignIn() {
    const getNavLinkClass = ({ isActive }) => `signin-link ${isActive ? 'active' : ''}`;
    // email 대신 identifier 사용
    const identifier = useInput('');
    const password = useInput('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('/api/signin', {
                username: identifier.value, // identifier.value 사용
                password: password.value,
            });
            // Backend now sets HttpOnly cookie, so no JWT in response.data.jwt
            // Just check for successful response status
            if (response.status === 200) {
                alert('로그인 성공!');
                await login(); // Call login without token argument
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            alert('로그인 실패: ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form">
                <h2 className="signin-title">로그인</h2>
                <form onSubmit={handleLogin}>
                    <div className="signin-form-group">
                        <label className="signin-label">아이디 또는 이메일:</label> {/* 레이블 변경 */}
                        <input type="text" className="signin-input" {...identifier} required /> {/* type="text"로 변경 */}
                    </div>
                    <div className="signin-form-group">
                        <label className="signin-label">비밀번호:</label>
                        <input type="password" className="signin-input" {...password} required />
                    </div>
                    {error && <div className="signin-error">{error}</div>}
                    <button type="submit" className="signin-button" disabled={loading}>
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