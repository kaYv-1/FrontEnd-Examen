import axiosInstance from './axios'
import type { Product, CreateProducto, UpdateProducto } from '@/types'

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/productos')
    return response.data
  },

  getById: async (id: number): Promise<Product> => {
    const response = await axiosInstance.get<Product>(`/productos/${id}`)
    return response.data
  },

  getByCategory: async (categoria: string): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/productos')
    // Filtrar por categoría en el cliente
    return response.data.filter(p => p.categoria === categoria)
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await axiosInstance.get<Product[]>('/productos')
    // Búsqueda simple por nombre o descripción
    const lowerQuery = query.toLowerCase()
    return response.data.filter(p => 
      p.nombre.toLowerCase().includes(lowerQuery) || 
      p.descripcion.toLowerCase().includes(lowerQuery)
    )
  },

  create: async (producto: CreateProducto): Promise<Product> => {
    const response = await axiosInstance.post<Product>('/productos', producto)
    return response.data
  },

  update: async (id: number, producto: UpdateProducto): Promise<Product> => {
    const response = await axiosInstance.put<Product>(`/productos/${id}`, producto)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/productos/${id}`)
  },
}
