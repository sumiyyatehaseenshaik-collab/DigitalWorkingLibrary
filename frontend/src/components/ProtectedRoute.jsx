import React from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = api.getCurrentUser();

  if (!user) {
    // Redirect to login if user not authenticated
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    // Redirect to dashboard if trying to access admin panel without permission
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
