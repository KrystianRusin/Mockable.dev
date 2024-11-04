import { useState } from 'react'
import axiosInstance from '../axiosConfig.ts'

const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const get = async (url: string, config = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.get(url, config)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const post = async (url: string, data = {}, config = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.post(url, data, config)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteApi = async (url: string, config = {}) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axiosInstance.delete(url, config)
      return response.data
    } catch (err: any) {
      setError(err.response?.data?.detail || 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Similarly, you can add put, delete, etc.

  return { loading, error, get, post, deleteApi }
}

export default useApi

