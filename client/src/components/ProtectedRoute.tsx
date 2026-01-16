import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  redirectAdminToPanel?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false, redirectAdminToPanel = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { isLoading: auth0Loading, isAuthenticated: auth0IsAuthenticated } = useAuth0();

  // Show loading only while Auth0 is initially loading
  if (auth0Loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(25, 118, 210, 0.3)',
          borderTopColor: '#1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{
          `@keyframes spin {
            to { transform: rotate(360deg); }
          }`
        }</style>
      </div>
    );
  }

  // Wait for user setup if Auth0 is authenticated but our context isn't ready yet
  if (auth0IsAuthenticated && !isAuthenticated && !user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
        fontSize: '16px',
        color: '#666'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid rgba(25, 118, 210, 0.3)',
          borderTopColor: '#1976d2',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p>Setting up your account...</p>
        <style>{
          `@keyframes spin {
            to { transform: rotate(360deg); }
          }`
        }</style>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!auth0IsAuthenticated || !isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // If admin should be redirected to admin panel
  if (redirectAdminToPanel && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
