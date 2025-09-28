import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'waiter';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { authState } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (authState.isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5'
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!authState.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permission if required
  if (requiredRole && authState.user?.role !== requiredRole) {
    // Redirect to appropriate page based on user role
    const redirectPath = authState.user?.role === 'admin' ? '/' : '/waiter';
    return <Navigate to={redirectPath} replace />;
  }

  // Auto-redirect based on user role if no specific role required
  if (!requiredRole && location.pathname === '/') {
    const redirectPath = authState.user?.role === 'waiter' ? '/waiter' : '/';
    if (redirectPath !== '/') {
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
