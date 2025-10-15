import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '../common/api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [roleType, setRoleType] = useState(null); // Add roleType state
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const response = await api.get('/api/checkSession'); // Assuming a backend endpoint to check session validity
      if (response.status === 200 && response.data.isAuthenticated) {
        setIsAuthenticated(true);
        setUser(response.data.user); // Assuming backend returns user info if authenticated
        setRoleType(response.data.roleType); // Get roleType from response body
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setRoleType(null); // Clear roleType if not authenticated
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setIsAuthenticated(false);
      setUser(null);
      setRoleType(null); // Clear roleType on error
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
        // checkSession will now update roleType from the response body
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      setIsAuthenticated(false);
      setUser(null);
      setRoleType(null); // Clear roleType on login failure
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await api.post('/api/logout'); // Assuming a backend endpoint to invalidate session
      setIsAuthenticated(false);
      setUser(null);
      setRoleType(null); // Clear roleType on logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      roleType, // Provide roleType in context
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
