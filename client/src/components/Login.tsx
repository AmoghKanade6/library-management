import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { loginWithRedirect, isLoading: auth0Loading } = useAuth0();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if user is authenticated
    if (isAuthenticated && user) {
      navigate('/', { replace: true });
    } else if (!auth0Loading && !isAuthenticated) {
      // Automatically redirect to Auth0 Universal Login
      loginWithRedirect({
        appState: {
          returnTo: window.location.pathname
        }
      });
    }
  }, [isAuthenticated, user, navigate, auth0Loading, loginWithRedirect]);

  // Show loading while redirecting
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p style={{ color: 'white', marginTop: '20px' }}>Redirecting to login...</p>
    </div>
  );
};

export default Login;
