import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Corrected import

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Check if token is expired
                if (decoded.exp * 1000 > Date.now()) {
                    setUser({ 
                        email: decoded.sub, 
                        role: decoded.auth, // Assuming role is stored in 'auth' claim
                        isLoggedIn: true 
                    });
                } else {
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Invalid token", error);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        try {
            const decoded = jwtDecode(token);
            setUser({ 
                email: decoded.sub, 
                role: decoded.auth, 
                isLoggedIn: true 
            });
        } catch (error) {
            console.error("Invalid token", error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const authContextValue = {
        user,
        loading,
        login,
        logout,
        isLoggedIn: user?.isLoggedIn,
        isAdmin: user?.role === 'ROLE_ADMIN',
        userId: user?.email
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);