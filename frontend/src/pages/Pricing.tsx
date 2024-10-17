import React from 'react';
import Navbar from '../components/UnauthenticatedNavbar.tsx';
import { Box, Typography } from '@mui/material';

const Pricing: React.FC = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Typography variant="body1">
          Our pricing plans are designed to meet the needs of businesses of all sizes.
        </Typography>
      </Box>
    </>
  );
};

export default Pricing;
