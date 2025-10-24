import React from 'react';
import { Link } from 'react-router-dom';
import './Error.css'; // Assuming a shared CSS file for error pages

const Error404 = () => {
  return (
    <div className="error-container">
      <h1 className="error-code">404</h1>
      <p className="error-message">페이지를 찾을 수 없습니다.</p>
      <p className="error-description">요청하신 페이지를 찾을 수 없습니다. 주소를 확인하거나 홈으로 돌아가세요.</p>
      <Link to="/" className="error-home-link">홈으로 돌아가기</Link>
    </div>
  );
};

export default Error404;
