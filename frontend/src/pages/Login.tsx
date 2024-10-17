import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApi from '../hooks/useApi.ts'
import { Button, TextField, Box, Typography, Alert } from '@mui/material'
import Navbar from '../components/UnauthenticatedNavbar.tsx'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { loading, error, post } = useApi()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = await post('/api/users/login', { username, password })
      localStorage.setItem('token', data.token)
      navigate('/home')
    } catch (err) {
      // Error is handled inside the hook
    }
  }

  const handleSignup = () => {
    navigate('/signup')
  }

  return (
    <>
      <Navbar />
      <Box display="flex" alignItems="center" justifyContent="center" height="calc(100vh - 64px)">
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Login
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
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
          <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={handleSignup}>
            Or Sign Up
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default Login
