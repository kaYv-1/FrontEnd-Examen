import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/components/templates'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <MainLayout>
      <Result
        status="404"
        title="404"
        subTitle="La página que buscas no existe"
        style={{ marginTop: '60px' }}
        extra={
          <Button type="primary" onClick={() => navigate('/')}>
            Ir a Inicio
          </Button>
        }
      />
    </MainLayout>
  )
}
