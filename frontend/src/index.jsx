import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './common/hook/AuthProvider'; // AuthProvider 임포트

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <AuthProvider> {/* App 컴포넌트를 AuthProvider로 감싸기 */}
      <App />
    </AuthProvider>
  </BrowserRouter>
);