import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const UnauthenticatedNavbar: React.FC = () => {
  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar sx={{ minHeight: 80 }}>
        {/* Brand Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 'bold',
          }}
        >
          Mockable.dev
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            color="inherit"
            component={Link}
            to="/pricing"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              // No hover effect on text color
            }}
          >
            Pricing
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/documentation"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              // No hover effect on text color
            }}
          >
            Product/Documentation
          </Button>
        </Box>

        {/* Login/Signup Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              borderColor: 'inherit',
              color: 'inherit',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#90a4ae',
                color: '#90a4ae',
              },
            }}
          >
            Login
          </Button>
          <Button
            component={Link}
            to="/signup"
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontSize: 16,
              borderColor: 'inherit',
              color: 'inherit',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: '#90a4ae',
                color: '#90a4ae',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UnauthenticatedNavbar;
