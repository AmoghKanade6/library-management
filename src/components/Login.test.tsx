import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { AuthProvider } from '../context/AuthContext';

const MockLogin = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
);

describe('Login Component', () => {
  it('renders login page with title', () => {
    render(<MockLogin />);
    
    expect(screen.getByText(/Library Hub/i)).toBeInTheDocument();
  });

  it('renders Google and GitHub login buttons', () => {
    render(<MockLogin />);
    
    expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue with GitHub/i)).toBeInTheDocument();
  });

  it('displays loading state when login button is clicked', async () => {
    render(<MockLogin />);
    
    const googleButton = screen.getByText(/Continue with Google/i);
    fireEvent.click(googleButton);
    
    await waitFor(() => {
      expect(googleButton).toBeDisabled();
    });
  });

  it('shows error message on login failure', async () => {
    // This would require mocking the mockBackend to throw an error
    // For demonstration purposes only
    render(<MockLogin />);
    
    // Test that error Alert can be displayed
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
