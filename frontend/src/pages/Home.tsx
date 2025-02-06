// Home.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig.ts';
import { User } from '../types/User.ts';

const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await axiosInstance.get('/api/users/me');
        setUser(response.data.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleManageEndpoints = () => {
    navigate('/endpoints');
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        {loading ? 'Loading Dashboard...' : `Welcome back, ${user?.username || user?.userSlug}!`}
      </Typography>

      {/* Quick Actions Section moved to the top */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="contained" color="primary" onClick={() => navigate('/endpoints/new')}>
            Create New Endpoint
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/logs')}>
            View Logs
          </Button>
          <Button variant="outlined" color="primary" onClick={() => navigate('/support')}>
            Contact Support
          </Button>
        </Box>
      </Box>

      {/* First Row: Basic Dashboard Cards */}
      <Grid container spacing={4} sx={{ mt: 2 }}>
        {/* My Endpoints Card */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                My Endpoints
              </Typography>
              <Typography variant="body2">
                You currently have <strong>5</strong> endpoints configured.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleManageEndpoints}
            >
              Manage Endpoints
            </Button>
          </Paper>
        </Grid>

        {/* Recent Activity Card */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
              // No button here, so no need to change alignment.
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2">
                No recent activity available.
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Usage Statistics Card */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Usage Statistics
              </Typography>
              <Typography variant="body2">
                You have made <strong>120</strong> API calls this month.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Second Row: Additional Dashboard Cards */}
      <Grid container spacing={4} sx={{ mt: 4 }}>
        {/* Subscription Plan Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                Subscription Plan
              </Typography>
              <Typography variant="body2">
                Your current plan is <strong>Free Tier</strong>.
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate('/billing')}
            >
              Upgrade Plan
            </Button>
          </Paper>
        </Grid>

        {/* API Performance Card */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}
          >
            <Box>
              <Typography variant="h6" gutterBottom>
                API Performance
              </Typography>
              <Typography variant="body2">
                Average Response Time: <strong>120ms</strong>
                <br />
                Error Rate: <strong>0.5%</strong>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
