import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { fetchCurrentUser, logoutUser } from '../api/userApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserDetails = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchCurrentUser();
            if (data.loggedIn) {
                setUser({ 
                    email: data.email, 
                    role: data.role, 
                    userId: data.userId, 
                    isLoggedIn: true 
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getUserDetails();
    }, [getUserDetails]);

    const login = useCallback(async () => {
        // After successful login (cookie set by backend), fetch user details
        await getUserDetails();
    }, [getUserDetails]);

    const logout = useCallback(async () => {
        try {
            await logoutUser();
            setUser(null);
            alert('로그아웃 되었습니다.');
        } catch (error) {
            console.error('Logout failed:', error);
            alert('로그아웃 실패.');
        }
    }, []);

    const authContextValue = {
        user,
        loading,
        login,
        logout,
        isLoggedIn: user?.isLoggedIn,
        isAdmin: user?.role?.toUpperCase() === 'ROLE_ADMIN',
        userId: user?.userId
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);