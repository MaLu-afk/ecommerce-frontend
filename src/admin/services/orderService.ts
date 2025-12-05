// src/admin/services/orderService.ts
import { http } from '../../api/http'
import type { Order, OrdersResponse, OrderStatus, DateFilter } from '../types/order'

// Ya no necesitas transformar porque el backend devuelve el formato correcto
const transformOrder = (order: any): Order => {
  return {
    id: order.id,
    pedido_numero: order.pedido_numero,
    cliente_nombre: order.cliente_nombre,
    cliente_email: order.cliente_email,
    productos_cantidad: order.productos_cantidad,
    total: order.total,
    fecha: order.fecha,
    estado: order.estado,
    direccion_envio: order.direccion_envio
  }
}

export const orderService = {
  // Obtener todos los pedidos con filtros (ADMIN)
  getAll: async (estado?: OrderStatus | 'todos', fecha?: DateFilter): Promise<OrdersResponse> => {
    try {
      const params = new URLSearchParams()
      
      if (estado && estado !== 'todos') {
        params.append('estado', estado)
      }
      
      if (fecha && fecha !== 'todos') {
        params.append('fecha', fecha)
      }

      const queryString = params.toString()
      const url = queryString ? `/admin/pedidos?${queryString}` : '/admin/pedidos'
      
      const response = await http.get(url)
      
      // El backend AdminOrderController devuelve { success, data, total }
      if (response.data.success) {
        const transformedOrders = response.data.data.map(transformOrder)
        return {
          success: true,
          data: transformedOrders,
          total: response.data.total
        }
      }
      
      return {
        success: false,
        data: [],
        total: 0,
        message: response.data.error || 'Error al obtener pedidos'
      }
    } catch (error: any) {
      return {
        success: false,
        data: [],
        total: 0,
        message: error.response?.data?.error || error.response?.data?.message || 'Error al obtener pedidos'
      }
    }
  },

  // Obtener un pedido específico (ADMIN)
  getById: async (id: number) => {
    try {
      const response = await http.get(`/admin/pedidos/${id}`)
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        }
      }
      
      return {
        success: false,
        data: null,
        message: response.data.error || 'Error al obtener pedido'
      }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || error.response?.data?.message || 'Error al obtener pedido'
      }
    }
  },

  // Actualizar estado del pedido (ADMIN)
  updateStatus: async (id: number, estado: OrderStatus) => {
    try {
      const response = await http.put(`/admin/pedidos/${id}/estado`, { estado })
      
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data
        }
      }
      
      return {
        success: false,
        data: null,
        message: response.data.error || 'Error al actualizar estado'
      }
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.response?.data?.error || error.response?.data?.message || 'Error al actualizar estado'
      }
    }
  }
}