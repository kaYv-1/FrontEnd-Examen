import { create } from 'zustand'
import type { User } from '@/types'
import { authService } from '@/services'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  initAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password })
      set({
        user: response.usuario,
        token: response.token,
        isAuthenticated: true,
      })
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  },

  logout: () => {
    authService.logout()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: !!user })
  },

  initAuth: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    if (token && user) {
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      })
    }
  },
}))
