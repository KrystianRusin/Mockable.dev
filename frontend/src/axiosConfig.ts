import axios from 'axios'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
})

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token')
    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error)
  }
)

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // Redirect with a query parameter indicating session expiration
      window.location.href = '/login?sessionExpired=true'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
