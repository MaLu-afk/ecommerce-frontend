// src/admin/hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react'
import { orderService } from '../services/orderService'
import type { Order, OrderFilters, OrderStatus } from '../types/order'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrderFilters>({
    estado: 'todos',
    fecha: 'todos'
  })

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await orderService.getAll(filters.estado, filters.fecha)
      
      if (response.success) {
        setOrders(response.data)
      } else {
        setError(response.message || 'Error al cargar pedidos')
      }
    } catch (err: any) {
      setError(err.message)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const updateOrderStatus = async (id: number, estado: OrderStatus) => {
    try {
      const response = await orderService.updateStatus(id, estado)
      
      if (response.success) {
        setOrders(prev => 
          prev.map(order => 
            order.id === id ? { ...order, estado } : order
          )
        )
        return true
      }
      return false
    } catch (err: any) {
      setError(err.message)
      return false
    }
  }

  const clearError = () => setError(null)

  return {
    orders,
    loading,
    error,
    filters,
    setFilters,
    updateOrderStatus,
    refreshOrders: fetchOrders,
    clearError
  }
}