import React from 'react'
import { Layout, Menu, Button, Space, Dropdown, Badge } from 'antd'
import { UserOutlined, LogoutOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useCart } from '@/hooks'
import type { MenuProps } from 'antd'

const { Header } = Layout

export const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuthStore()
  const { itemCount } = useCart()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userMenu: MenuProps['items'] = [
    {
      key: 'profile',
      label: 'Mi perfil',
      icon: <UserOutlined />,
      onClick: () => navigate('/profile'),
    },
    {
      key: 'orders',
      label: 'Mis órdenes',
      onClick: () => navigate('/orders'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Cerrar sesión',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  return (
    <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>
          🥗 HuertoHogar
        </Link>

        <Menu mode="horizontal" style={{ border: 'none', flex: 1, marginLeft: '40px' }}>
          <Menu.Item key="home">
            <Link to="/">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="products">
            <Link to="/products">Productos</Link>
          </Menu.Item>
        </Menu>

        <Space>
          <Badge count={itemCount} offset={[-5, 5]}>
            <Button 
              type="text" 
              icon={<ShoppingCartOutlined style={{ fontSize: '18px' }} />}
              onClick={() => navigate('/cart')}
            />
          </Badge>
          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenu }} trigger={['click']}>
              <Button type="text" icon={<UserOutlined />}>
                {user?.name || user?.nombre}
              </Button>
            </Dropdown>
          ) : (
            <>
              <Button type="text">
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button type="primary">
                <Link to="/register">Registrarse</Link>
              </Button>
            </>
          )}
        </Space>
      </div>
    </Header>
  )
}
