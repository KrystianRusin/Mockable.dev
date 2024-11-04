import { useEffect, useState } from 'react'
import axiosInstance from '../axiosConfig.ts' // Custom Axios
import { Button, Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import {User} from '../types/User.ts'

const Home = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/login')
        return
      }
      try {
        const response = await axiosInstance.get('/api/users/me')
        setUser(response.data.user)
      } catch (err) {
        console.error('Failed to fetch message:', err)
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
      {user ? (
      <Typography variant="body1" gutterBottom>
        {user.userSlug}
      </Typography>
    ) : (
      <Typography variant="body1" gutterBottom>
        Loading...
      </Typography>
    )}
      <Button variant="contained" color="secondary" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  )
}

export default Home