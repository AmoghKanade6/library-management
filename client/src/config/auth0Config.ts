// Auth0 Configuration
// Replace these with your actual Auth0 credentials from https://auth0.com/

export const auth0Config = {
  domain: (process.env.REACT_APP_AUTH0_DOMAIN || 'your-domain.auth0.com') as string,
  clientId: (process.env.REACT_APP_AUTH0_CLIENT_ID || 'your-client-id') as string,
  redirectUri: window.location.origin,
  scope: 'openid profile email'
};

// Admin emails list
export const ADMIN_EMAILS = [
  'admin@library.com'
  // Add more admin emails here
];

// Auth0 roles configuration
export const AUTH0_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Helper to check if user has admin role
export const isAdmin = (user: any): boolean => {
  if (!user) return false;
  
  // Check if user email is in admin list
  const userEmail = user.email?.toLowerCase();
  if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
    return true;
  }
  
  // Also check for role in app_metadata, user_metadata, or custom claims
  const roles = 
    user?.['https://library-app.com/roles'] || 
    user?.app_metadata?.roles || 
    user?.user_metadata?.roles || 
    [];
  
  return roles.includes(AUTH0_ROLES.ADMIN);
};

// Helper to grant admin access to a user (email)
export const addAdminEmail = (email: string): boolean => {
  const normalizedEmail = email.toLowerCase();
  if (!ADMIN_EMAILS.includes(normalizedEmail)) {
    ADMIN_EMAILS.push(normalizedEmail);
    // In production, this should be saved to a database or Auth0 app_metadata
    localStorage.setItem('adminEmails', JSON.stringify(ADMIN_EMAILS));
    return true;
  }
  return false;
};

// Helper to remove admin access
export const removeAdminEmail = (email: string): boolean => {
  const normalizedEmail = email.toLowerCase();
  const index = ADMIN_EMAILS.indexOf(normalizedEmail);
  if (index > -1 && normalizedEmail !== 'admin@library.com') { // Can't remove primary admin
    ADMIN_EMAILS.splice(index, 1);
    localStorage.setItem('adminEmails', JSON.stringify(ADMIN_EMAILS));
    return true;
  }
  return false;
};

// Load admin emails from localStorage on startup
const savedAdmins = localStorage.getItem('adminEmails');
if (savedAdmins) {
  try {
    const parsed = JSON.parse(savedAdmins);
    parsed.forEach((email: string) => {
      if (!ADMIN_EMAILS.includes(email)) {
        ADMIN_EMAILS.push(email);
      }
    });
  } catch (e) {
    console.error('Failed to load admin emails:', e);
  }
}
