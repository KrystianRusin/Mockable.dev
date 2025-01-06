import React from 'react';
import { Box, Typography, Divider, List, ListItem, ListItemText } from '@mui/material';

const Documentation: React.FC = () => {
  return (
    <>
      <Box sx={{ padding: 4, maxWidth: '800px', margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Mockable.dev Documentation
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to the Mockable.dev documentation. Here, you'll find all the information you need to get started and make the most of our API Mocking service.
        </Typography>

        <Divider sx={{ marginY: 3 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            Getting Started
          </Typography>
          <Typography variant="body1" gutterBottom>
            Learn how to set up your Mockable.dev account and integrate it into your development workflow.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="1. Signing up for an account" />
            </ListItem>
            <ListItem>
              <ListItemText primary="2. Creating your first mock endpoint" />
            </ListItem>
            <ListItem>
              <ListItemText primary="3. Integrating with your application" />
            </ListItem>
          </List>
        </Box>

        <Divider sx={{ marginY: 3 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            API Reference
          </Typography>
          <Typography variant="body1" gutterBottom>
            Explore detailed documentation on our API endpoints, including request and response formats.
          </Typography>
        </Box>

        <Divider sx={{ marginY: 3 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            Advanced Features
          </Typography>
          <Typography variant="body1" gutterBottom>
            Unlock advanced features such as dynamic responses, rate limiting, and custom authentication.
          </Typography>
        </Box>

        <Divider sx={{ marginY: 3 }} />

        <Box>
          <Typography variant="h5" gutterBottom>
            FAQ
          </Typography>
          <Typography variant="body1" gutterBottom>
            Get answers to the most commonly asked questions about Mockable.dev.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Documentation;
