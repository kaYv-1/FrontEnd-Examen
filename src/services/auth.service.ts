import axiosInstance from './axios'
import type { LoginRequest, LoginResponse, User, RegisterRequest } from '@/types'

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials)
    
    const { token, usuario } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(usuario))
    
    return response.data
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/auth/registro', data)
    
    const { token, usuario } = response.data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(usuario))
    
    return response.data
  },

  logout: (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Nota: El backend actual no tiene endpoint de refresh token
  // Esta función se mantiene para compatibilidad pero lanzará error
  refreshToken: async (): Promise<string> => {
    throw new Error('Refresh token not implemented in backend')
  },
}
