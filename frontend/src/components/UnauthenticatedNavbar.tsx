import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const UnauthenticatedNavbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Brand Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
        >
          Mockable.dev
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/pricing">
            Pricing
          </Button>
          <Button color="inherit" component={Link} to="/documentation">
            Product/Documentation
          </Button>
        </Box>

        {/* Login/Signup Buttons */}
        <Box sx={{ marginLeft: 2 }}>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default UnauthenticatedNavbar;
