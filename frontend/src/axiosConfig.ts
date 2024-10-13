import axios from 'axios'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Adjust based on backend URL
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

// Add a response interceptor (optional)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors, e.g., token expiration
    if (error.response && error.response.status === 401) {
      // Redirect to login or refresh token logic
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
