import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  console.log('ProtectedRoute: isAuthenticated =', isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
} 