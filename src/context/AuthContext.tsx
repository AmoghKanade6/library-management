import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { User, AuthContextType } from '../types';
import { mockBackend } from '../services/mockBackend';
import { trackingService } from '../services/trackingService';
import { isAdmin } from '../config/auth0Config';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { 
    user: auth0User, 
    isAuthenticated: auth0IsAuthenticated, 
    isLoading,
    loginWithRedirect,
    logout: auth0Logout,
    getAccessTokenSilently
  } = useAuth0();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupUser = async () => {
      if (isLoading) {
        return;
      }

      if (auth0IsAuthenticated && auth0User) {
        try {
          // Get access token for API calls
          const token = await getAccessTokenSilently().catch(() => null);
          
          // Map Auth0 user to our User type
          const mappedUser: User = {
            id: auth0User.sub || '',
            email: auth0User.email || '',
            name: auth0User.name || auth0User.email || 'User',
            role: isAdmin(auth0User) ? 'admin' : 'user',
            provider: auth0User.sub?.split('|')[0] as 'google' | 'github' || 'google',
            borrowedBooks: []
          };

          // Sync with mock backend to get borrowedBooks from localStorage
          const { user: backendUser } = await mockBackend.login(
            mappedUser.provider,
            mappedUser.email,
            mappedUser.name
          );
          
          // Update role if admin
          if (mappedUser.role === 'admin') {
            backendUser.role = 'admin';
          }

          console.log('AuthContext: User setup complete', {
            userId: backendUser.id,
            borrowedBooks: backendUser.borrowedBooks
          });

          setUser(backendUser);
          
          // Track login
          trackingService.trackLogin(backendUser.id, mappedUser.provider);
          
          if (token) {
            localStorage.setItem('authToken', token);
          }
        } catch (error) {
          console.error('Error setting up user:', error);
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    };

    setupUser();
  }, [auth0User, auth0IsAuthenticated, isLoading, getAccessTokenSilently]);

  const login = async (provider: 'google' | 'github') => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: provider === 'google' ? 'google-oauth2' : 'github',
          screen_hint: 'signup'
        }
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user) {
        trackingService.trackLogout(user.id);
      }
      
      // Clear local state immediately
      setUser(null);
      await mockBackend.logout();
      localStorage.removeItem('authToken');
      
      // Auth0 logout will redirect, no need to wait
      auth0Logout({
        logoutParams: {
          returnTo: window.location.origin
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if there's an error, clear local state
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const refreshUser = async () => {
    if (!auth0User) return;
    
    try {
      // Re-sync with localStorage to get updated borrowedBooks
      const users = JSON.parse(localStorage.getItem('library_users') || '[]');
      const currentUserId = auth0User.sub || '';
      const updatedUser = users.find((u: User) => u.id === currentUserId);
      
      if (updatedUser) {
        console.log('RefreshUser: Updated borrowed books', updatedUser.borrowedBooks);
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    refreshUser
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
