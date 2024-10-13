import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../axiosConfig.ts'
import { Button, TextField, Box, Typography, Alert } from '@mui/material'

const Signup = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axiosInstance.post('/signup/', { username, password })
      navigate('/login')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Signup failed')
    }
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Signup
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          type="text"
          label="Username"
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
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Signup
        </Button>
      </Box>
    </Box>
  )
}

export default Signup
