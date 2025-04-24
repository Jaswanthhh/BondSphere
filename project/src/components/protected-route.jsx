import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth-context';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}; 