import React from 'react';
import { NavLink } from 'react-router-dom';
import LoadingSpinner from '../../common/components/LoadingSpinner';
import useSignIn from './hook/useSignIn'; // 새로 생성한 훅 임포트
import './SignIn.css';

function SignIn() {
    const getNavLinkClass = ({ isActive }) => `signin-link ${isActive ? 'active' : ''}`;
    const { identifier, password, error, loading, handleLogin } = useSignIn(); // 훅 사용

    return (
        <div className="signin-container">
            <div className="signin-form">
                <h2 className="signin-title">로그인</h2>
                <form onSubmit={handleLogin}>
                    <div className="signin-form-group">
                        <label className="signin-label">아이디 또는 이메일:</label>
                        <input type="text" className="signin-input" {...identifier} required />
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