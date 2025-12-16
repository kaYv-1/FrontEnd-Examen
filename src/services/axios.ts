import axios, { AxiosInstance, AxiosError } from 'axios'
import { authService } from '@/services'

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000/api'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para agregar token JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(config as any).headers = { ...(config as any).headers, Authorization: `Bearer ${token}` }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y refresh automático
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = (error.config as any) || {}

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await authService.refreshToken()
        localStorage.setItem('token', newToken)
        // retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        } else {
          originalRequest.headers = { Authorization: `Bearer ${newToken}` }
        }
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // refresh failed -> clear auth and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
