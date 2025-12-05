// src/api/orders.ts
import { http } from './http'

export interface CheckoutResponse {
  message: string
  order_number: string
  total: number
}

export interface OrderDetail {
  id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  producto?: {
    id: number
    nombre: string
    imagen: string | null
    precio: number
  }
}

export interface CreateOrderData {
  user_id?: number
  total: number
  estado: string
  detalles: Array<{
    producto_id: number
    cantidad: number
    precio_unitario: number
  }>
}

export interface Order {
  id: number
  pedido_numero: string
  user_id: number
  total: number
  estado: string
  direccion_envio?: string | null
  notas?: string | null
  fecha_pedido: string
  created_at: string
  updated_at: string
  productos_cantidad: number
  detalles?: OrderDetail[]
}

/* ========= Tipos para /checkout ========= */

export interface CheckoutItem {
  producto_id: number
  cantidad: number
  precio_unitario: number
}

export interface CheckoutShipping {
  nombre?: string
  email?: string
  departamento: string
  provincia: string
  distrito: string
  addressLine: string
  reference?: string
}

export interface CheckoutPayload {
  items: CheckoutItem[]
  shipping: CheckoutShipping
  total?: number
  note?: string
}

/* ========= Llamadas a la API ========= */

export const createOrder = async (orderData: CreateOrderData) => {
  const response = await http.post('/pedidos', orderData)
  return response
}

export const checkoutOrder = async (payload: CheckoutPayload) => {
  const { data } = await http.post<CheckoutResponse>('/checkout', payload)
  return data
}

export const getOrders = async () => {
  const response = await http.get('/pedidos')
  return response
}

export const getOrderById = async (id: number) => {
  const response = await http.get(`/pedidos/${id}`)
  return response
}
