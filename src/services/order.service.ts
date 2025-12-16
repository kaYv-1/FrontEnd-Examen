import axiosInstance from './axios'
import type { Venta, CreateVenta } from '@/types'

export const orderService = {
  // Obtener todas las ventas (según el rol del usuario autenticado)
  getAll: async (): Promise<Venta[]> => {
    const response = await axiosInstance.get<Venta[]>('/ventas')
    return response.data
  },

  // Obtener ventas por fecha (solo admin)
  getByDate: async (fecha: string): Promise<Venta[]> => {
    const response = await axiosInstance.get<Venta[]>(`/ventas/${fecha}`)
    return response.data
  },

  // Obtener resumen diario (solo admin)
  getDailySummary: async (fecha?: string): Promise<any> => {
    const queryParam = fecha ? `?fecha=${fecha}` : ''
    const response = await axiosInstance.get(`/ventas/resumen/diario${queryParam}`)
    return response.data
  },

  // Crear una nueva venta
  create: async (venta: CreateVenta): Promise<Venta> => {
    const response = await axiosInstance.post<Venta>('/ventas', venta)
    return response.data
  },

  // Completar una venta
  complete: async (id: number): Promise<Venta> => {
    const response = await axiosInstance.put<Venta>(`/ventas/${id}/completar`)
    return response.data
  },

  // Cancelar una venta
  cancel: async (id: number): Promise<Venta> => {
    const response = await axiosInstance.put<Venta>(`/ventas/${id}/cancelar`)
    return response.data
  },

  // Alias para compatibilidad con código existente
  getById: async (id: number): Promise<Venta> => {
    // El backend no tiene este endpoint, retornar de la lista
    const ventas = await orderService.getAll()
    const venta = ventas.find(v => v.id === id)
    if (!venta) throw new Error('Venta no encontrada')
    return venta
  },

  updateStatus: async (id: number, status: 'completada' | 'pendiente' | 'cancelada'): Promise<Venta> => {
    if (status === 'completada') {
      return orderService.complete(id)
    } else if (status === 'cancelada') {
      return orderService.cancel(id)
    }
    throw new Error('Estado no soportado')
  },
}
