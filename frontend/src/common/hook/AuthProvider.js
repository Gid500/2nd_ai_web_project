import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../pages/signin/api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkLoginStatus = async () => {
        try {
            const response = await api.get('/api/session-status');
            setIsLoggedIn(response.data.loggedIn);
        } catch (error) {
            console.error('Failed to check login status:', error);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []);

    const login = () => {
        setIsLoggedIn(true);
    };

    const logout = async () => {
        try {
            await api.post('/api/logout');
            setIsLoggedIn(false);
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('로그아웃 실패.');
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);