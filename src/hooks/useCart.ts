// src/hooks/useCart.ts
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  
  return context;
}
