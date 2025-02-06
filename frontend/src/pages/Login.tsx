import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig.ts';
import { Button, TextField, Box, Typography, Alert, Paper, IconButton } from '@mui/material';
import Navbar from '../components/UnauthenticatedNavbar.tsx';
import { jwtDecode } from 'jwt-decode';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/users/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decodedToken: { userId: string; username: string; userSlug: string; exp: number } = jwtDecode(token);
      localStorage.setItem('userSlug', decodedToken.userSlug);
      navigate('/home');
    } catch (err: any) {
      console.error('Failed to login:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleGoogleSignIn = () => {
    window.location.href = '/api/users/google';
  };
  return (
    <>
      <Navbar />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 64px)"
        sx={{
          background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
        }}
        p={2}
      >
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              type="text"
              label="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2 }}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            {/* Google Icon - Clickable Icon Only */}
            <IconButton onClick={handleGoogleSignIn} sx={{ mt: 2, display: 'block', mx: 'auto' }}>
              <FcGoogle size={24} />
            </IconButton>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don't have an account?{' '}
              <Button variant="text" onClick={handleSignup} sx={{ textTransform: 'none' }}>
                Signup
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
