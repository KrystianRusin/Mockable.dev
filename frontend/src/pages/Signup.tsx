import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig.ts';
import { Button, TextField, Box, Typography, Alert, Paper } from '@mui/material';
import Navbar from '../components/UnauthenticatedNavbar.tsx';
import { jwtDecode } from 'jwt-decode';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [confirmEmailError, setConfirmEmailError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset all errors
    setUsernameError(null);
    setPasswordError(null);
    setEmailError(null);
    setConfirmEmailError(null);
    setGeneralError(null);

    let hasError = false;

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      hasError = true;
    }

    if (email !== confirmEmail) {
      setConfirmEmailError('Emails do not match');
      hasError = true;
    }

    if (!username) {
      setUsernameError('Username is required');
      hasError = true;
    }

    if (!email) {
      setEmailError('Email is required');
      hasError = true;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format');
      hasError = true;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Password must be over 6 characters long, contain at least 1 capital letter and 1 symbol');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const response = await axiosInstance.post<{ token: string }>('/api/users/signup', { username, password, email });
      const { token } = response.data;
      localStorage.setItem('token', token);
      const decodedToken: { userId: string; username: string; userSlug: string; exp: number } = jwtDecode(token);
      localStorage.setItem('userSlug', decodedToken.userSlug);
      navigate('/home');
    } catch (err: any) {
      console.error("Signup error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        const serverError = err.response.data.message;
        if (serverError.includes('exists')) {
          setGeneralError("An account with that username or email already exists. Please try logging in.");
        } else {
          setGeneralError(serverError);
        }
      } else {
        setGeneralError('Signup failed. Please try again later.');
      }
    }
  };

  const handleLogin = () => {
    navigate('/login');
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
          background: 'linear-gradient(135deg, #ece9e6, #ffffff)', // Updated background gradient
        }}
        p={2}
      >
        <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Signup
          </Typography>
          {generalError && <Alert severity="error" sx={{ mb: 2 }}>{generalError}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              type="text"
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              fullWidth
              margin="normal"
              error={Boolean(usernameError)}
              helperText={usernameError}
            />
            <TextField
              type="text"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
              error={Boolean(emailError)}
              helperText={emailError}
            />
            <TextField
              type="text"
              label="Confirm Email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
              fullWidth
              margin="normal"
              error={Boolean(confirmEmailError)}
              helperText={confirmEmailError}
            />
            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
            <TextField
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              margin="normal"
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Signup
            </Button>
            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{' '}
              <Button onClick={handleLogin} sx={{ textTransform: 'none', p: 0, minWidth: 'unset' }}>
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Signup;
