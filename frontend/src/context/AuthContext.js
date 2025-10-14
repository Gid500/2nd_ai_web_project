import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../common/api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await api.get('/api/checkSession');
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUser({ id: response.data.replace('세션 유효: ', '') }); // "세션 유효: 사용자ID" 에서 사용자ID 추출
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoginStatus();
  }, []);

  const login = async (identifier, userPwd) => {
    try {
      const response = await api.post('/api/login', { identifier, userPwd });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser({ id: response.data.userId }); // 로그인 성공 후 받은 사용자 ID로 user 상태 설정
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      throw error; // 로그인 실패 시 에러를 다시 던져서 SignIn.jsx에서 처리할 수 있도록 함
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
      setIsAuthenticated(false);
      setUser(null);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, setIsAuthenticated, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
