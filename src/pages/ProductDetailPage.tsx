import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Image, InputNumber, Button, message, Spin } from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { MainLayout } from '@/components/templates'
import { Card } from '@/components/atoms'
import { useCart } from '@/hooks'
import { productService } from '@/services'
import type { Product } from '@/types'

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const fallbackByCategory: Record<string, string> = {
    'Frutas Frescas': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
    'Verduras Orgánicas': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Carrot.jpg',
    'Productos Orgánicos': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Honey_and_honeycomb.jpg',
    'Productos Lácteos': 'https://upload.wikimedia.org/wikipedia/commons/8/86/Milk_glass.jpg',
  }
  const defaultFallback = 'https://via.placeholder.com/800x600?text=Producto'

  useEffect(() => {
    if (!id) return

    setLoading(true)
    productService
      .getById(parseInt(id))
      .then((data) => {
        setProduct(data)
        setImgSrc(data.imagen || null)
      })
      .catch(() => message.error('Producto no encontrado'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAddToCart = async () => {
    if (!product || quantity < 1) {
      message.warning('Cantidad inválida')
      return
    }

    setAdding(true)
    try {
      addToCart(product, quantity)
      message.success(`${product.nombre} agregado al carrito`)
      setQuantity(1)
    } catch {
      message.error('Error al agregar al carrito')
    } finally {
      setAdding(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Spin />
        </div>
      </MainLayout>
    )
  }

  if (!product) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h2>Producto no encontrado</h2>
          <Button onClick={() => navigate('/products')}>Volver a Productos</Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/products')}
        style={{ marginBottom: '24px' }}
      >
        Volver
      </Button>

      <Row gutter={[32, 32]}>
        <Col xs={24} lg={12}>
          {imgSrc ? (
            <Image 
              src={imgSrc} 
              alt={product.nombre} 
              style={{ width: '100%' }} 
              onError={() => {
                const fallback = fallbackByCategory[product.categoria] || defaultFallback
                setImgSrc(fallback)
              }}
            />
          ) : (
            <div
              style={{
                width: '100%',
                height: '400px',
                backgroundColor: '#f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
              }}
            >
              Sin imagen
            </div>
          )}
        </Col>

        <Col xs={24} lg={12}>
          <h1>{product.nombre}</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>{product.descripcion}</p>

          <Card style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ color: '#999', fontSize: '12px' }}>Precio</p>
              <h2 style={{ margin: '8px 0', color: '#2ecc71', fontSize: '32px' }}>
                ${product.precio.toFixed(2)}
              </h2>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px' }}>Disponibilidad: {product.stock} unidades</p>
              {product.stock === 0 && (
                <p style={{ color: 'red' }}>Producto agotado</p>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ marginBottom: '4px', color: '#555' }}>Origen</p>
              <p style={{ margin: 0 }}>{product.origen || 'Producto local'}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <p style={{ marginBottom: '4px', color: '#555' }}>Prácticas sostenibles</p>
              <p style={{ margin: 0 }}>{product.practicas_sostenibles || 'Prácticas responsables con el ambiente'}</p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>Cantidad:</label>
              <InputNumber
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(val) => setQuantity(val || 1)}
                style={{ width: '100%' }}
              />
            </div>

            <Button
              type="primary"
              size="large"
              block
              icon={<ShoppingCartOutlined />}
              loading={adding}
              disabled={product.stock === 0}
              onClick={handleAddToCart}
            >
              Agregar al Carrito
            </Button>
          </Card>

          <Card>
            <h3>Información del Producto</h3>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Categoría: {product.categoria}</li>
              <li>Stock disponible: {product.stock} unidades</li>
              <li>Origen: {product.origen || 'Local'}</li>
              <li>Prácticas sostenibles: {product.practicas_sostenibles || 'Cultivo responsable'}</li>
            </ul>
          </Card>

          <Card style={{ marginTop: '16px' }}>
            <h3>Recetas sugeridas</h3>
            <ul style={{ paddingLeft: '20px' }}>
              {(product.recetas_sugeridas || '').split(';').filter(Boolean).map((receta) => (
                <li key={receta.trim()}>{receta.trim()}</li>
              ))}
              {!product.recetas_sugeridas && <li>Prueba este producto en ensaladas, bowls y salteados.</li>}
            </ul>
          </Card>

          <Card style={{ marginTop: '16px' }}>
            <h3>Impacto ambiental</h3>
            <p style={{ marginBottom: '8px' }}>
              Estás apoyando agricultura local y reduciendo la huella de transporte. Compra responsable = menor CO₂.
            </p>
            <p style={{ margin: 0, color: '#2ecc71', fontWeight: 600 }}>
              Huella evitada estimada: {(0.8 * quantity).toFixed(2)} kg CO₂e
            </p>
            <p style={{ marginTop: '8px', color: '#555' }}>
              Cada compra impulsa a productores locales y mejores prácticas agrícolas en la comunidad.
            </p>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  )
}
