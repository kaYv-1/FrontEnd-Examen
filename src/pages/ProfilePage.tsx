import React from 'react'
import { Card, Descriptions, Button, message, Space } from 'antd'
import { EditOutlined, LogoutOutlined } from '@ant-design/icons'
import { MainLayout } from '@/components/templates'
import { useAuthStore } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  if (!user) {
    navigate('/login')
    return null
  }

  const handleLogout = () => {
    logout()
    message.success('Sesión cerrada')
    navigate('/login')
  }

  return (
    <MainLayout>
      <h1>Mi Perfil</h1>

      <Card style={{ maxWidth: '600px' }}>
        <Descriptions title="Información Personal" bordered>
          <Descriptions.Item label="Nombre">{user.nombre}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Teléfono" span={3}>
            {user.telefono || 'No especificado'}
          </Descriptions.Item>
          <Descriptions.Item label="Dirección" span={3}>
            {user.direccion || 'No especificada'}
          </Descriptions.Item>
          <Descriptions.Item label="ID de Usuario" span={3}>
            {user.id}
          </Descriptions.Item>
        </Descriptions>

        <Space style={{ marginTop: '24px' }}>
          <Button icon={<EditOutlined />} disabled>
            Editar Perfil
          </Button>
          <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Space>
      </Card>

      <Card style={{ marginTop: '16px', maxWidth: '600px' }}>
        <h3>Historial y recomendaciones</h3>
        <p style={{ marginBottom: 12 }}>
          Consulta tu historial de compras, repite pedidos fácilmente y descubre sugerencias personalizadas según lo que más compras.
        </p>
        <Space>
          <Button type="primary" onClick={() => navigate('/orders')}>
            Ver historial
          </Button>
          <Button onClick={() => navigate('/products')}>
            Explorar productos
          </Button>
        </Space>
      </Card>
    </MainLayout>
  )
}
