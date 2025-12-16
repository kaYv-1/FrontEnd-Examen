import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { useAuthStore } from '@/store/auth.store'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Loader } from '@/components/atoms'

// Lazy-loaded pages to improve initial bundle size
const HomePage = React.lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const LoginPage = React.lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage').then(m => ({ default: m.ProductsPage })))
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })))
const CartPage = React.lazy(() => import('@/pages/CartPage').then(m => ({ default: m.CartPage })))
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })))
const OrdersPage = React.lazy(() => import('@/pages/OrdersPage').then(m => ({ default: m.OrdersPage })))
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

export const App = () => {
  React.useEffect(() => {
    const initAuth = useAuthStore.getState().initAuth
    initAuth()
  }, [])

  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#2ecc71' } }}>
      <BrowserRouter>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 60 }}><Loader loading={true} /></div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ConfigProvider>
  )
}
