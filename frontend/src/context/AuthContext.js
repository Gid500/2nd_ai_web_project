import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../common/api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const response = await api.get('/api/checkSession'); // Assuming a backend endpoint to check session validity
      if (response.status === 200 && response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user); // Assuming backend returns user info if authenticated
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
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
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/api/logout'); // Assuming a backend endpoint to invalidate session
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
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
