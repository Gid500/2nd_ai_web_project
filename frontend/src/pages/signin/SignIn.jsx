import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../common/hook/useInput';
import api from '../../common/api/axios'; // baseURL, withCredentials=true
import TermsModal from './TermsModal';
import '../../asset/css/SignIn.css';

export default function SignIn() {
  const navigate = useNavigate();
  const [Email, handleEmailChange] = useInput('');
  const [Pwd, handlePwdChange] = useInput('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Email || !Pwd) return;

    try {
      setLoading(true);
      const response = await api.post('/api/login', { identifier: Email, userPwd: Pwd }); 
      
      if (response.status === 200) {
        navigate('/');
      } else {
        alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
      }
    } catch (err) {
      console.error(err);
      alert('로그인 실패: 이메일 또는 비밀번호를 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  // 백엔드 OAuth2 엔드포인트 (Spring Security 표준 경로 가정)
  const API = process.env.REACT_APP_API_URL || "http://localhost:8080";
  const KAKAO_AUTH = `${API}/oauth2/authorization/kakao`;
  const GOOGLE_AUTH = `${API}/oauth2/authorization/google`;

  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>

        <div className="form-group">
          <label htmlFor="Email">Email or User ID</label>
          <input
            name="Email"
            type="text"
            id="Email"
            value={Email}
            onChange={handleEmailChange}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="Pwd">Password</label>
          <input
            name="Pwd"
            type="password"
            id="Pwd"
            value={Pwd}
            onChange={handlePwdChange}
            autoComplete="current-password"
          />
        </div>

        <div className="signin-links">
          <Link to="/signUp" className="text-btn">회원가입</Link>
          <Link to="/password/reset" className="text-btn">PW찾기</Link>
          <button type="button" className="text-btn" onClick={() => setShowTerms(true)}>
            이용약관
          </button>
        </div>

        <button type="submit" className="signin-button" disabled={loading || !Email || !Pwd}>
          {loading ? '로그인 중…' : '로그인'}
        </button>

        <div className="divider">또는</div>

        <div className="social-buttons">
          <a className="btn-kakao" href={KAKAO_AUTH}>카카오 로그인</a>
          <a className="btn-google" href={GOOGLE_AUTH}>Google 로그인</a>
        </div>
      </form>

      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}
