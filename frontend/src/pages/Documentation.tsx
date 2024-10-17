import React from 'react';
import Navbar from '../components/UnauthenticatedNavbar.tsx';
import { Box, Typography } from '@mui/material';

const Documentation: React.FC = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Product Documentation
        </Typography>
        <Typography variant="body1">
          Learn how to use Mockify.IO effectively with our comprehensive documentation.
        </Typography>
      </Box>
    </>
  );
};

export default Documentation;
