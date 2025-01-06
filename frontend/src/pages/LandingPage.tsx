import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Navbar from '../components/UnauthenticatedNavbar.tsx';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <>
      <Navbar />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 64px)" // Adjusting for Navbar height
        sx={{ padding: 2 }}
      >
        <Typography variant="h3" gutterBottom>
          Welcome to Mockable.dev
        </Typography>
        <Typography variant="h6" gutterBottom>
          Your ultimate solution for creating realistic mock APIs.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStarted}
          sx={{ mt: 4 }}
        >
          Get Started
        </Button>
      </Box>
    </>
  );
};

export default LandingPage;
