import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hook/useAuth';
import Admin from '../../pages/admin/Admin';

const AdminRouteWrapper = () => {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return isAdmin ? <Admin /> : <Navigate to="/403" replace />;
};

export default AdminRouteWrapper;
