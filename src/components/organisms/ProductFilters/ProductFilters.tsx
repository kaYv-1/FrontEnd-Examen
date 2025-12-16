import React from 'react'
import { Row, Col, Select } from 'antd'
import { Input } from '@/components/atoms'

interface ProductFiltersProps {
  onSearch?: (query: string) => void
  onCategoryChange?: (category: string) => void
  onSort?: (sort: string) => void
}

const categories = [
  { label: 'Todas las categorías', value: '' },
  { label: 'Verduras', value: 'vegetables' },
  { label: 'Frutas', value: 'fruits' },
  { label: 'Hierbas', value: 'herbs' },
]

const sortOptions = [
  { label: 'Relevancia', value: 'relevance' },
  { label: 'Precio: menor a mayor', value: 'price_asc' },
  { label: 'Precio: mayor a menor', value: 'price_desc' },
  { label: 'Más recientes', value: 'newest' },
]

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onSearch,
  onCategoryChange,
  onSort,
}) => {
  return (
    <div style={{ padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginBottom: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Input
            placeholder="Buscar productos..."
            onChange={(e) => onSearch?.(e.target.value)}
            allowClear
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Select
            placeholder="Categoría"
            options={categories}
            onChange={(value) => onCategoryChange?.(value)}
            style={{ width: '100%' }}
          />
        </Col>

        <Col xs={24} sm={12} lg={8}>
          <Select
            placeholder="Ordenar por"
            options={sortOptions}
            onChange={(value) => onSort?.(value)}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
    </div>
  )
}
