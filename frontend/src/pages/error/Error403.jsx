import React from 'react';
import { Link } from 'react-router-dom';
import './Error.css'; // Assuming a shared CSS file for error pages

const Error403 = () => {
  return (
    <div className="error-container">
      <h1 className="error-code">403</h1>
      <p className="error-message">접근 권한이 없습니다.</p>
      <p className="error-description">요청하신 페이지에 접근할 권한이 없습니다. 로그인 상태를 확인하거나 관리자에게 문의해주세요.</p>
      <Link to="/" className="error-home-link">홈으로 돌아가기</Link>
    </div>
  );
};

export default Error403;
