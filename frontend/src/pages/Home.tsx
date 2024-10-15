import { useEffect, useState } from 'react'
import axiosInstance from '../axiosConfig.ts' // Custom Axios
import { Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate()
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const fetchMessage = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      try {
        const response = await axiosInstance.get('/api/home')
        setMessage(response.data.message)
      } catch (err) {
        // Error is handled by Axios interceptor
      }
    }
    fetchMessage()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
      <Typography variant="h2" gutterBottom>
        Welcome Home!
      </Typography>
      <Typography variant="body1" gutterBottom>
        {message}
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  )
}

export default Home