import React from 'react'
import { Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { Card, Button } from '@/components/atoms'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart 
}) => {
  return (
    <Card
      hoverable
      style={{ height: '100%' }}
      cover={
        <Link to={`/products/${product.id}`}>
          {product.imagen ? (
            <img alt={product.nombre} src={product.imagen} style={{ height: '200px', objectFit: 'cover' }} />
          ) : (
            <div style={{ height: '200px', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Sin imagen
            </div>
          )}
        </Link>
      }
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3>{product.nombre}</h3>
        <p style={{ color: '#666', fontSize: '12px' }}>{product.descripcion}</p>
      </Link>
      
      <Row justify="space-between" align="middle" style={{ marginBottom: '16px' }}>
        <Col>
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#2ecc71' }}>
            ${product.precio.toFixed(2)}
          </span>
        </Col>
        <Col>
          <span style={{ fontSize: '12px', color: '#999' }}>
            Stock: {product.stock}
          </span>
        </Col>
      </Row>

      <Button 
        type="primary" 
        block
        onClick={() => onAddToCart?.(product)}
      >
        Añadir al carrito
      </Button>
    </Card>
  )
}
