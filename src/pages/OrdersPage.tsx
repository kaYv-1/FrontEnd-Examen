import React, { useState, useEffect } from 'react'
import { Table, Tag, Empty, Button, Space, Typography, Card, List } from 'antd'
import { MainLayout } from '@/components/templates'
import { Loader } from '@/components/atoms'
import { useAuthStore } from '@/store/auth.store'
import { orderService } from '@/services'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/hooks'
import type { TableColumnsType } from 'antd'
import type { Order } from '@/types'

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addToCart } = useCart()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const load = async () => {
      try {
        setLoading(true)
        const data = await orderService.getAll()
        setOrders(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isAuthenticated, navigate])

  const getStatusColor = (status: Order['estado']) => {
    const colors: Record<Order['estado'], string> = {
      pendiente: 'orange',
      completada: 'green',
      cancelada: 'red',
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status: Order['estado']) => {
    const labels: Record<Order['estado'], string> = {
      pendiente: 'Pendiente',
      completada: 'Completada',
      cancelada: 'Cancelada',
    }
    return labels[status] || status
  }

  const handleRepeat = (order: Order) => {
    if (!order.detalles?.length) return
    order.detalles.forEach((d) => {
      if (d.producto) {
        addToCart(d.producto, d.cantidad)
      }
    })
  }

  const recommended = orders
    .flatMap((o) => o.detalles || [])
    .filter((d) => d.producto)
    .reduce<Record<number, { producto: any; count: number }>>((acc, d) => {
      if (!d.producto) return acc
      acc[d.producto.id] = acc[d.producto.id]
        ? { producto: d.producto, count: acc[d.producto.id].count + d.cantidad }
        : { producto: d.producto, count: d.cantidad }
      return acc
    }, {})

  const topRecommended = Object.values(recommended)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((r) => r.producto)

  const ImpactNote = () => (
    <Card style={{ marginBottom: 16 }}>
      <Typography.Title level={4}>Impacto ambiental</Typography.Title>
      <Typography.Paragraph>
        Comprar local reduce transporte y emisiones. Por cada pedido estimamos un ahorro de ~1.5 kg CO₂e frente a compras importadas.
      </Typography.Paragraph>
      <Typography.Paragraph>
        Además, apoyas a productores de la comunidad y prácticas agrícolas sostenibles.
      </Typography.Paragraph>
    </Card>
  )

  const Recommendations = () => (
    <Card style={{ marginBottom: 16 }}>
      <Typography.Title level={4}>Recomendaciones para ti</Typography.Title>
      {topRecommended.length === 0 && <Typography.Text>Compra algo para ver recomendaciones personalizadas.</Typography.Text>}
      {topRecommended.length > 0 && (
        <List
          dataSource={topRecommended}
          renderItem={(item) => (
            <List.Item>
              <Space direction="vertical" size={4}>
                <Typography.Text strong>{item.nombre}</Typography.Text>
                <Typography.Text type="secondary">{item.categoria} · Origen: {item.origen || 'Local'}</Typography.Text>
              </Space>
            </List.Item>
          )}
        />
      )}
    </Card>
  )

  const columns: TableColumnsType<Order> = [
    {
      title: 'ID Orden',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: 'Fecha',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('es-ES'),
    },
    {
      title: 'Items',
      dataIndex: 'detalles',
      key: 'detalles',
      render: (items) => items?.length || 0,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      render: (total) => `$${total.toFixed(2)}`,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (status: Order['estado']) => (
        <Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_value, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleRepeat(record)}>
            Repetir pedido
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <MainLayout>
      <h1>Mis Órdenes</h1>

      <ImpactNote />
      <Recommendations />

      {loading && <Loader loading={true} />}

      {!loading && orders.length === 0 && (
        <Empty description="No tienes órdenes" style={{ marginTop: '60px' }} />
      )}

      {!loading && orders.length > 0 && (
        <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 10 }} />
      )}
    </MainLayout>
  )
}
