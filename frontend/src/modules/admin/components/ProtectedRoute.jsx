import React from 'react';
import { Outlet } from 'react-router-dom';
import { useRBAC } from '../data/RBACContext';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ permission }) => {
  const { hasPermission } = useRBAC();

  if (!hasPermission(permission)) {
    return <AccessDenied />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
