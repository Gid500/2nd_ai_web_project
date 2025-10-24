import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkLoginStatus = async () => {
        try {
            const response = await api.get('/api/checkSession');
            setIsLoggedIn(response.data.isAuthenticated);
            setIsAdmin(response.data.roleType && response.data.roleType.toLowerCase() === 'admin');
        } catch (error) {
            console.error('Failed to check login status:', error);
            setIsLoggedIn(false);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const login = () => {
        setIsLoggedIn(true);
        // Re-check admin status after login, as it might have changed
        checkLoginStatus(); 
    };

    const logout = async () => {
        try {
            await api.post('/api/session-logout');
            setIsLoggedIn(false);
            setIsAdmin(false);
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('로그아웃 실패.');
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);