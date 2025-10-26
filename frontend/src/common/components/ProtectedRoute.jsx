import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hook/AuthProvider';

const ProtectedRoute = () => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a spinner
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
