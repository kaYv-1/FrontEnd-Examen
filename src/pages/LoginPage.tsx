import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { MainLayout } from '@/components/templates'
import { LoginForm } from '@/components/molecules'
import { useLogin } from '@/hooks'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { handleLogin, loading, error } = useLogin()

  useEffect(() => {
    if (error) {
      message.error(error)
    }
  }, [error])

  const onSubmit = async (values: { email: string; password: string }) => {
    const success = await handleLogin(values.email, values.password)
    if (success) {
      message.success('¡Sesión iniciada!')
      navigate('/')
    }
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '400px', margin: '60px auto', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>🥗 HuertoHogar</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Iniciar Sesión</h2>
        <LoginForm onSubmit={onSubmit} loading={loading} />
        <p style={{ textAlign: 'center', marginTop: '16px' }}>
          ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
        </p>
      </div>
    </MainLayout>
  )
}
