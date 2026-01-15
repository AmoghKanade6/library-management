import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { ADMIN_EMAILS, addAdminEmail, removeAdminEmail } from '../config/auth0Config';

const UserManagement: React.FC = () => {
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddAdmin = () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    const success = addAdminEmail(newAdminEmail);
    if (success) {
      setMessage({ 
        type: 'success', 
        text: `${newAdminEmail} has been granted admin access. They need to login to see admin panel.` 
      });
      setNewAdminEmail('');
    } else {
      setMessage({ type: 'error', text: 'This email already has admin access' });
    }
  };

  const handleRemoveAdmin = (email: string) => {
    const success = removeAdminEmail(email);
    if (success) {
      setMessage({ type: 'success', text: `Admin access removed for ${email}` });
    } else {
      setMessage({ type: 'error', text: 'Cannot remove primary admin account' });
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AdminPanelSettingsIcon color="primary" />
        User Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Grant or revoke admin access to users. Users must login to see changes.
      </Typography>

      {message && (
        <Alert 
          severity={message.type} 
          onClose={() => setMessage(null)}
          sx={{ mb: 3 }}
        >
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Grant Admin Access
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter the email address of the user you want to make an admin
        </Typography>
        
        <Stack direction="row" spacing={2}>
          <TextField
            label="Email Address"
            type="email"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            placeholder="user@example.com"
            fullWidth
            size="small"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddAdmin();
              }
            }}
          />
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddAdmin}
            sx={{ minWidth: '160px' }}
          >
            Grant Access
          </Button>
        </Stack>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Admins ({ADMIN_EMAILS.length})
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        {ADMIN_EMAILS.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No admin users found
          </Typography>
        ) : (
          <List>
            {ADMIN_EMAILS.map((email) => (
              <ListItem 
                key={email}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemText
                  primary={email}
                  secondary={
                    <Chip 
                      label="Admin" 
                      size="small" 
                      color="primary" 
                      sx={{ mt: 0.5 }}
                    />
                  }
                />
                <ListItemSecondaryAction>
                  {email !== 'admin@library.com' ? (
                    <IconButton
                      edge="end"
                      aria-label="remove"
                      onClick={() => handleRemoveAdmin(email)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <Chip 
                      label="Primary Admin" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                    />
                  )}
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Important Notes:
        </Typography>
        <Typography variant="body2" component="div">
          • Admin users can access the Admin Panel to manage books and inventory
          <br />
          • Users must logout and login again to see admin access
          <br />
          • Primary admin (admin@library.com) cannot be removed
          <br />
          • Changes are saved locally and persist across sessions
        </Typography>
      </Alert>
    </Box>
  );
};

export default UserManagement;
