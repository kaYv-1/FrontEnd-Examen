import { useState, useEffect, useCallback } from 'react'
import { productService } from '@/services'
import type { Product } from '@/types'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Cargando productos...')
      const data = await productService.getAll()
      console.log('Productos cargados:', data)
      setProducts(data)
    } catch (err) {
      console.error('Error al cargar productos:', err)
      const message = err instanceof Error ? err.message : 'Error al cargar productos'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const searchProducts = useCallback(async (query: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await productService.search(query)
      setProducts(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error en la búsqueda'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getByCategory = useCallback(async (category: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await productService.getByCategory(category)
      setProducts(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar categoría'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, fetchProducts, searchProducts, getByCategory }
}
