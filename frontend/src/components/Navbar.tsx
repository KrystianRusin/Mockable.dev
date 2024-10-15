import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* Product Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Mockify.IO
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

        {/* Login/Signup Links */}
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

export default Navbar;
