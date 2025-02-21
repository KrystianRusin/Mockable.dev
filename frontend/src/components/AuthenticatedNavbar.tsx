import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

const AuthenticatedNavbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: 'primary.main', boxShadow: 4 }}
    >
      <Toolbar sx={{ minHeight: 80 }}>
        {/* Title: Only the text is clickable */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '1.25rem', md: '1.5rem' },
          }}
        >
          <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
            Mockable.dev
          </Link>
        </Typography>

        {/* Spacer to push navigation links to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Button
            variant="text"
            component={Link}
            to="/home"
            sx={{
              textTransform: 'none',
              color: 'inherit',
              transition: 'color 0.3s',
              '&:hover': { color: '#90a4ae' },
            }}
          >
            Home
          </Button>
          <Button
            variant="text"
            component={Link}
            to="/endpoints"
            sx={{
              textTransform: 'none',
              color: 'inherit',
              transition: 'color 0.3s',
              '&:hover': { color: '#90a4ae' },
            }}
          >
            Endpoints
          </Button>
          <Button
            variant="text"
            component={Link}
            to="/documentation"
            sx={{
              textTransform: 'none',
              color: 'inherit',
              transition: 'color 0.3s',
              '&:hover': { color: '#90a4ae' },
            }}
          >
            Product/Documentation
          </Button>
          <Button
            variant="text"
            component={Link}
            to="/validate-schema"
            sx={{
              textTransform: 'none',
              color: 'inherit',
              transition: 'color 0.3s',
              '&:hover': { color: '#90a4ae' },
            }}
          >
            JSON Validator
          </Button>
        </Box>

        {/* Logout Button */}
        <Box sx={{ ml: 3 }}>
          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              borderColor: 'inherit',
              color: 'inherit',
              transition: 'all 0.3s ease',
              '&:hover': { borderColor: '#90a4ae', color: '#90a4ae' },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AuthenticatedNavbar;
