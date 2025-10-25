import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import Admin from '../../pages/admin/Admin';
import LoadingSpinner from './LoadingSpinner';

const AdminRouteWrapper = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return isAdmin ? <Admin /> : <Navigate to="/403" replace />;
};

export default AdminRouteWrapper;
