import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, Typography, Alert, Paper } from '@mui/material';
import UnauthenticatedNavbar from '../components/UnauthenticatedNavbar.tsx';
import axiosInstance from '../axiosConfig.ts';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  userId: string;
  username: string;
  userSlug: string;
  exp: number;
}

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Reset any previous error
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/users/login', { username, password });
      const { token } = response.data;
      
      // Save token and decode user details
      localStorage.setItem('token', token);
      const decodedToken: DecodedToken = jwtDecode(token);
      localStorage.setItem('userSlug', decodedToken.userSlug);
      localStorage.setItem('userId', decodedToken.userId);
      
      navigate('/home');
    } catch (err: any) {
      console.error('Failed to login:', err);
      if (err.response && err.response.data && err.response.data.message) {
        const serverError = err.response.data.message;
        if (serverError === 'User not found.') {
          setError("We couldn't find an account with that username or email. Please consider signing up.");
        } else {
          setError(serverError);
        }
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

  return (
    <>
      <UnauthenticatedNavbar />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="calc(100vh - 64px)"
        sx={{
          background: 'linear-gradient(135deg, #ece9e6, #ffffff)', // Updated background gradient
        }}
        p={2}
      >
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
              sx={{ mt: 2 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{' '}
            <Button onClick={handleSignup} sx={{ textTransform: 'none' }}>
              Sign Up
            </Button>
          </Typography>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
