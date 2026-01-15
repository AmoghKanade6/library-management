import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import AdminDashboard from './AdminDashboard';
import AddBookForm from './AddBookForm';
import InventoryManagement from './InventoryManagement';
import BorrowHistory from './BorrowHistory';
import UserManagement from './UserManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const AdminPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold" color="primary">
          Admin Control Panel
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your library inventory and monitor system activity
        </Typography>
      </Box>

      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            borderBottom: '1px solid #e0e0e0',
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '0.95rem',
              py: 2
            }
          }}
        >
          <Tab icon={<DashboardIcon />} iconPosition="start" label="Dashboard" />
          <Tab icon={<AddCircleIcon />} iconPosition="start" label="Add Books" />
          <Tab icon={<InventoryIcon />} iconPosition="start" label="Inventory" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="History" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Users" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <AdminDashboard />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <AddBookForm />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <InventoryManagement />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <BorrowHistory />
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <UserManagement />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminPanel;
