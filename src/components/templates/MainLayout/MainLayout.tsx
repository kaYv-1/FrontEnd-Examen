import React from 'react'
import { Layout } from 'antd'
import { Navbar } from '@/components/organisms'

interface MainLayoutProps {
  children: React.ReactNode
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Navbar />
      <Layout.Content style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {children}
      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center', backgroundColor: '#f0f0f0' }}>
        <p>© 2025 HuertoHogar. Todos los derechos reservados.</p>
      </Layout.Footer>
    </Layout>
  )
}
