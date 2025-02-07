// src/pages/Mfa.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Alert, Paper } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../axiosConfig.ts';
import { jwtDecode } from 'jwt-decode';

interface AuthPayload {
  userId: string;
  username: string;
  userSlug: string;
  email: string;
  exp: number;
  mfa: boolean;
}

const Mfa: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');

  // On mount, extract token from URL query and store it in localStorage if not already stored.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Decode the token to extract the email.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<AuthPayload>(token);
        setEmail(decoded.email);
        console.log("Extracted email:", decoded.email);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  // Once the email is available, request an OTP.
  useEffect(() => {
    const requestOtp = async () => {
      try {
        console.log("Requesting OTP for email:", email);
        const response = await axiosInstance.post('/api/users/request-otp', { email });
        setMessage(response.data.message || "OTP sent to your email.");
      } catch (err: any) {
        console.error("Error requesting OTP: ", err);
        setError(err.response?.data?.message || "Error requesting OTP.");
      }
    };
    if (email) {
      requestOtp();
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/users/verify-otp', { email, otp });
      const { token: finalToken } = response.data;
      localStorage.setItem("token", finalToken);
      navigate('/home');
    } catch (err: any) {
      console.error("OTP Verification failed", err);
      setError(err.response?.data?.message || 'OTP Verification Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    try {
      console.log("Resending OTP for email:", email);
      const response = await axiosInstance.post('/api/users/request-otp', { email });
      setMessage(response.data.message || 'OTP resent to your email.');
    } catch (err: any) {
      console.error('Error resending OTP:', err);
      setError(err.response?.data?.message || 'Error resending OTP.');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          Verify Your Account
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          An OTP has been sent to: {email}
        </Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
          <Button variant="text" onClick={handleResendOtp} fullWidth sx={{ mt: 2 }}>
            Resend OTP
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Mfa;
