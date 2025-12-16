import React, { useState } from 'react'
import { Table, Button, Space, message, Row, Col, Card as AntCard, Modal, Select, Input } from 'antd'
import { DeleteOutlined, MinusOutlined, PlusOutlined, ShoppingOutlined } from '@ant-design/icons'
import { MainLayout } from '@/components/templates'
import { useCart } from '@/hooks'
import { orderService } from '@/services'
import { useAuthStore } from '@/store/auth.store'
import { useNavigate } from 'react-router-dom'
import type { TableColumnsType } from 'antd'
import type { CartItem } from '@/types'

export const CartPage: React.FC = () => {
  const navigate = useNavigate()
  const { items, total, removeFromCart, updateItemQuantity, clearCart } = useCart()
  const { isAuthenticated } = useAuthStore()
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'tarjeta' | 'transferencia'>('efectivo')
  const [referenciaPago, setReferenciaPago] = useState<string>('')

  const handleCheckout = async () => {
    if (items.length === 0) {
      message.warning('Tu carrito está vacío')
      return
    }

    if (!isAuthenticated) {
      message.info('Debes iniciar sesión para completar la compra')
      navigate('/login')
      return
    }

    try {
      const orderPayload = {
        items: items.map((i) => ({ producto_id: i.producto_id, cantidad: i.cantidad })),
        metodo_pago: metodoPago,
        referencia_pago: referenciaPago || undefined,
      }
      const created = await orderService.create(orderPayload as any)
      clearCart()
      Modal.success({
        title: 'Orden creada correctamente',
        content: (
          <div>
            <p>ID de la orden: <strong>{created.id}</strong></p>
            <p>Total: <strong>${created.total.toFixed(2)}</strong></p>
            <p>Revisa tus órdenes en la sección <strong>Mis Órdenes</strong>.</p>
          </div>
        ),
        onOk() {
          navigate('/orders')
        },
      })
    } catch (err: any) {
      console.error(err)
      message.error(err?.message || 'Error al crear la orden')
    }
  }

  const columns: TableColumnsType<CartItem> = [
    {
      title: 'Producto',
      dataIndex: ['product', 'nombre'],
      key: 'nombre',
      render: (_, record) => record.product?.nombre || 'Producto desconocido',
    },
    {
      title: 'Precio Unitario',
      dataIndex: ['product', 'precio'],
      key: 'precio',
      render: (_, record) => `$${(record.product?.precio || 0).toFixed(2)}`,
    },
    {
      title: 'Cantidad',
      key: 'cantidad',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            size="small"
            icon={<MinusOutlined />}
            onClick={() => updateItemQuantity(record.producto_id, record.cantidad - 1)}
          />
          <span style={{ minWidth: '30px', textAlign: 'center' }}>{record.cantidad}</span>
          <Button
            type="text"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => updateItemQuantity(record.producto_id, record.cantidad + 1)}
          />
        </Space>
      ),
    },
    {
      title: 'Subtotal',
      key: 'subtotal',
      render: (_, record) => `$${((record.product?.precio || 0) * record.cantidad).toFixed(2)}`,
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeFromCart(record.producto_id)}
        />
      ),
    },
  ]

  if (items.length === 0) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <ShoppingOutlined style={{ fontSize: '48px', color: '#999', marginBottom: '24px' }} />
          <h2>Tu carrito está vacío</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>Agrega productos para comenzar</p>
          <Button type="primary" onClick={() => navigate('/products')}>
            Ver Productos
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <h1>🛒 Mi Carrito</h1>

      <Table
        columns={columns}
        dataSource={items}
        rowKey="producto_id"
        pagination={false}
        style={{ marginBottom: '24px' }}
      />

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Button block danger onClick={() => clearCart()}>
            Vaciar Carrito
          </Button>
        </Col>

        <Col xs={24} lg={8}>
          <AntCard>
            <div style={{ marginBottom: '16px' }}>
              <p>Subtotal: <strong>${total.toFixed(2)}</strong></p>
              <p>Envío: <strong>Gratis</strong></p>
              <hr />
              <h3 style={{ margin: '16px 0 0 0' }}>
                Total: <strong style={{ color: '#2ecc71' }}>${total.toFixed(2)}</strong>
              </h3>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: 8 }}>Método de pago</label>
              <Select
                value={metodoPago}
                onChange={(v) => setMetodoPago(v)}
                options={[
                  { value: 'efectivo', label: 'Efectivo' },
                  { value: 'tarjeta', label: 'Tarjeta' },
                  { value: 'transferencia', label: 'Transferencia' },
                ]}
                style={{ width: '100%' }}
              />
            </div>

            {(metodoPago === 'tarjeta' || metodoPago === 'transferencia') && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  {metodoPago === 'tarjeta' ? 'Referencia (últimos 4 dígitos)' : 'Referencia de transferencia'}
                </label>
                <Input
                  placeholder={metodoPago === 'tarjeta' ? '1234' : 'ID/Comprobante'}
                  value={referenciaPago}
                  onChange={(e) => setReferenciaPago(e.target.value)}
                />
              </div>
            )}

            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" block size="large" onClick={handleCheckout}>
                Proceder al Pago
              </Button>
              <Button block onClick={() => navigate('/products')}>
                Seguir Comprando
              </Button>
            </Space>
          </AntCard>
        </Col>
      </Row>
    </MainLayout>
  )
}
