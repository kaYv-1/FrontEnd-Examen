import { useState, useCallback } from 'react'
import { useAuthStore } from '@/store/auth.store'

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const login = useAuthStore((state) => state.login)

  const handleLogin = useCallback(async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      await login(email, password)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(message)
      return false
    } finally {
      setLoading(false)
    }
  }, [login])

  return { handleLogin, loading, error }
}
