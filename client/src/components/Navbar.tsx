import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Badge
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <Toolbar sx={{ py: 1.5, px: { xs: 2, md: 4 } }}>
        {/* Logo Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 }
          }}
          onClick={() => navigate('/')}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5
            }}
          >
            <MenuBookIcon sx={{ fontSize: 28, color: 'white' }} />
          </Box>
          <Typography 
            variant="h5" 
            component="div" 
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Library Hub
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Links */}
        {user && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
              {/* Browse Books - For all users */}
              <Button
                onClick={() => navigate('/')}
                startIcon={<LibraryBooksIcon />}
                sx={{
                  color: isActive('/') ? '#667eea' : '#666',
                  fontWeight: isActive('/') ? 700 : 500,
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  background: isActive('/') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.15)',
                  }
                }}
              >
                Books
              </Button>

              {/* Admin Panel - Only for admins */}
              {user.role === 'admin' && (
                <Button
                  onClick={() => navigate('/admin')}
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: isActive('/admin') ? '#667eea' : '#666',
                    fontWeight: isActive('/admin') ? 700 : 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: isActive('/admin') ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.15)',
                    }
                  }}
                >
                  Admin Panel
                </Button>
              )}
            </Box>

            {/* User Profile Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* User Badge */}
              {user.role === 'admin' && (
                <Box
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}
                >
                  Admin
                </Box>
              )}

              {/* Profile Avatar */}
              <IconButton
                onClick={handleMenu}
                sx={{
                  p: 0,
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  transition: 'transform 0.2s'
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#44b700',
                      color: '#44b700',
                      boxShadow: '0 0 0 2px white',
                      '&::after': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        animation: 'ripple 1.2s infinite ease-in-out',
                        border: '1px solid currentColor',
                        content: '""',
                      },
                    },
                    '@keyframes ripple': {
                      '0%': {
                        transform: 'scale(.8)',
                        opacity: 1,
                      },
                      '100%': {
                        transform: 'scale(2.4)',
                        opacity: 0,
                      },
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
              </IconButton>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 240,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {/* User Info */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                    {user.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
                    {user.email}
                  </Typography>
                </Box>

                <Divider />

                {/* My Borrowed Books - For normal users */}
                {user.role !== 'admin' && user.borrowedBooks && user.borrowedBooks.length > 0 && (
                  <>
                    <MenuItem onClick={() => { handleClose(); navigate('/?view=borrowed'); }}>
                      <ListItemIcon>
                        <Badge badgeContent={user.borrowedBooks.length} color="primary">
                          <HistoryIcon fontSize="small" />
                        </Badge>
                      </ListItemIcon>
                      My Borrowed Books
                    </MenuItem>
                    <Divider />
                  </>
                )}

                {/* Logout */}
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" color="error" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
