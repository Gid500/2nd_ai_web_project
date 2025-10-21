import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../common/api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [roleType, setRoleType] = useState(null); // roleType 상태 추가
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const response = await api.get('/api/checkSession'); // 세션 유효성 검사를 위한 백엔드 엔드포인트 가정
      if (response.status === 200 && response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user); // 인증된 경우 백엔드가 사용자 정보를 반환한다고 가정
        setRoleType(response.data.roleType); // 응답 본문에서 roleType 가져오기
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setRoleType(null); // 인증되지 않은 경우 roleType 초기화
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setRoleType(null); // 오류 발생 시 roleType 초기화
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (identifier, userPwd) => {
    try {
      const response = await api.post('/api/login', { identifier, userPwd });
      if (response.status === 200) {
        setIsAuthenticated(true);
        await checkSession(); 
        // 이제 checkSession이 응답 본문에서 roleType을 업데이트합니다.
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      setRoleType(null); // 로그인 실패 시 roleType 초기화
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/api/logout'); // 세션 무효화를 위한 백엔드 엔드포인트 가정
      setIsAuthenticated(false);
      setUser(null);
      setRoleType(null); // 로그아웃 시 roleType 초기화
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      roleType, // 컨텍스트에 roleType 제공
      loading,
      login,
      logout,
      setIsAuthenticated,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
