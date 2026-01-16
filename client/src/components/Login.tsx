import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const Login: React.FC = () => {
  const { loginWithRedirect, isLoading: auth0Loading, isAuthenticated: auth0IsAuthenticated } = useAuth0();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // If fully authenticated (both Auth0 and our context), redirect based on role
      if (auth0IsAuthenticated && isAuthenticated && user) {
        // Redirect admins to admin panel, regular users to books page
        if (user.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
        return;
      }

      // If Auth0 is still loading, wait
      if (auth0Loading) {
        return;
      }

      // If not authenticated with Auth0, redirect to login
      if (!auth0IsAuthenticated) {
        await loginWithRedirect({
          appState: {
            returnTo: '/'
          }
        });
      }
    };

    handleAuth();
  }, [auth0IsAuthenticated, isAuthenticated, user, navigate, auth0Loading, loginWithRedirect]);

  // Show loading while setting up authentication
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: 2,
      backgroundColor: '#f5f7fa'
    }}>
      <CircularProgress size={60} />
      <p style={{ color: '#666', marginTop: '20px', fontSize: '16px' }}>
        {auth0IsAuthenticated ? 'Setting up your account...' : 'Redirecting to login...'}
      </p>
    </Box>
  );
};

export default Login;
