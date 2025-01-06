import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const AuthenticatedNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); // To refresh the Navbar view
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Brand Name */}
        <Typography
          variant="h6"
          component={Link}
          to="/home"
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
          <Button color="inherit" component={Link} to="/endpoints">
            Endpoints
          </Button>
          <Button color="inherit" component={Link} to="/documentation">
            Product/Documentation
          </Button>
          <Button color="inherit" component={Link} to="/validate-schema">
            JSON Validator
          </Button>
        </Box>

        {/* Logout Button */}
        <Box sx={{ marginLeft: 2 }}>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AuthenticatedNavbar;

