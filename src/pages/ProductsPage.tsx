import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Row, Col, message, Empty, Card, Button, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { MainLayout } from '@/components/templates'
import { Loader } from '@/components/atoms'
import axiosInstance from '@/services/axios'
import type { Product } from '@/types'
import { useCart } from '@/hooks'

export const ProductsPage: React.FC = () => {
  const fallbackByCategory: Record<string, string> = {
    'Frutas Frescas': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg',
    'Verduras Orgánicas': 'https://upload.wikimedia.org/wikipedia/commons/2/28/Carrot.jpg',
    'Productos Orgánicos': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Honey_and_honeycomb.jpg',
    'Productos Lácteos': 'https://upload.wikimedia.org/wikipedia/commons/8/86/Milk_glass.jpg',
  }
  const defaultFallback = 'https://via.placeholder.com/600x400?text=Producto'

  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { addToCart } = useCart()

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await axiosInstance.get<Product[]>('/productos')
        setProducts(response.data)
        setFilteredProducts(response.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Error al cargar productos'
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Filtrar productos cuando cambian búsqueda o categoría
  useEffect(() => {
    let filtered = products

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(query) || 
        p.descripcion.toLowerCase().includes(query)
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(p => p.categoria === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory, products])

  // Obtener categorías únicas
  const categories = Array.from(new Set(products.map(p => p.categoria)))

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
    message.success(`${product.nombre} agregado al carrito`)
  }

  if (error) {
    return (
      <MainLayout>
        <div style={{ color: 'red', textAlign: 'center', padding: '60px' }}>
          <h2>Error al cargar productos</h2>
          <p>{error}</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div style={{ padding: '20px 0' }}>
        <h1>Nuestros Productos</h1>

        {/* Filtros */}
        <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Input
            placeholder="Buscar producto..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '300px' }}
            allowClear
          />
          
          <Select
            placeholder="Filtrar por categoría"
            style={{ width: '200px' }}
            value={selectedCategory}
            onChange={setSelectedCategory}
            allowClear
          >
            {categories.map(cat => (
              <Select.Option key={cat} value={cat}>
                {cat}
              </Select.Option>
            ))}
          </Select>
        </div>

        {loading && <Loader loading={true} />}
        
        {!loading && filteredProducts.length === 0 && (
          <Empty description="No hay productos disponibles" />
        )}

        {!loading && filteredProducts.length > 0 && (
          <>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
            <Row gutter={[16, 16]}>
              {filteredProducts.map((product) => (
                <Col key={product.id} xs={24} sm={12} lg={8}>
                  <Card 
                    hoverable
                    cover={
                      product.imagen ? (
                        <img 
                          alt={product.nombre} 
                          src={product.imagen} 
                          style={{ height: '200px', objectFit: 'cover' }} 
                          onError={(e) => {
                            const fallback = fallbackByCategory[product.categoria] || defaultFallback
                            e.currentTarget.src = fallback
                            e.currentTarget.onerror = null
                          }}
                        />
                      ) : (
                        <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          Sin imagen
                        </div>
                      )
                    }
                  >
                    <h3>
                      <Link to={`/products/${product.id}`}>{product.nombre}</Link>
                    </h3>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
                      Categoría: {product.categoria}
                    </p>
                    <p style={{ color: '#777', fontSize: '12px', marginBottom: '8px' }}>
                      Origen: {product.origen || 'Local'}
                    </p>
                    <p style={{ color: '#666', height: '60px', overflow: 'hidden', marginBottom: '16px' }}>
                      {product.descripcion}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#2ecc71' }}>
                        ${product.precio.toFixed(2)}
                      </span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Button><Link to={`/products/${product.id}`}>Ver detalle</Link></Button>
                        <Button 
                          type="primary" 
                          onClick={() => handleAddToCart(product)}
                        >
                          Añadir
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}
      </div>
    </MainLayout>
  )
}
