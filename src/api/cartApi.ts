// Doncito


import { http } from './http'
import type { CartItem } from '../types/productCart'

export const getCartItems = async (): Promise<CartItem[]> => {
  const response = await http.get('/carrito')
  return response.data
}

export const addToCart = async (productId: number, quantity: number): Promise<CartItem> => {
  const response = await http.post('/carrito', { product_id: productId, quantity })
  return response.data
}

export const updateCartItem = async (cartItemId: number, quantity: number): Promise<CartItem> => {
  const response = await http.put(`/carrito/${cartItemId}`, { quantity })
  return response.data
}

export const removeCartItem = async (cartItemId: number): Promise<void> => {
  await http.delete(`/carrito/${cartItemId}`)
}