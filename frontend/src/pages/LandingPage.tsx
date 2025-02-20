import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
          color: '#fff',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Mockable.dev
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Build, test, and use your API mocks in minutes.
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleSignup}
              sx={{
                mr: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              onClick={handleLogin}
              sx={{
                transition: 'transform 0.3s ease, border-color 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: 'primary.main',
                },
              }}
            >
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Why Choose Mockable.dev?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Fast & Easy
              </Typography>
              <Typography variant="body1">
                Create and deploy your mock APIs in minutes with our intuitive platform.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Customizable Responses
              </Typography>
              <Typography variant="body1">
                Generate dynamic responses with your own JSON schemas and GPT-powered data.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center', height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Secure & Scalable
              </Typography>
              <Typography variant="body1">
                Our platform is built with security and scalability in mind, ensuring reliability.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Call-to-Action Section */}
      <Box
        sx={{
          backgroundColor: '#f0f2f5',
          py: { xs: 6, md: 8 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to get started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Sign up today and streamline your API development workflow.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSignup}
            sx={{
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            Create Your Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 3 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()} Mockable.dev. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
