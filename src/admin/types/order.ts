// src/admin/types/order.ts

export type OrderStatus = 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado'
export type DateFilter = 'todos' | 'hoy' | 'semana' | 'mes'

export interface Order {
  id: number
  pedido_numero: string
  cliente_nombre: string
  cliente_email: string
  productos_cantidad: number
  total: number
  fecha: string
  estado: OrderStatus
  direccion_envio: string
}

export interface OrderFilters {
  estado: OrderStatus | 'todos'
  fecha: DateFilter
}

export interface OrdersResponse {
  success: boolean
  data: Order[]
  total: number
  message?: string
}