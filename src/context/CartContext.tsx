// src/context/CartContext.tsx
import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { getCartItems, addToCart as addToCartApi, updateCartItem, removeCartItem } from '../api/cartApi';
import { http } from '../api/http';
import { useAuth } from '../hooks/useAuth';
import type { CartItem } from '../types/productCart';

type CartContextType = {
  cartItems: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Asegurar que cartItems siempre sea un array
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const items = await getCartItems();
      // Asegurar que items sea un array
      setCartItems(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      // En caso de error, establecer array vacío
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Cargar carrito al montar y cuando el usuario inicie sesión
  useEffect(() => {
    if (isAuthenticated) {
      // Usuario autenticado: sincronizar carrito local con backend
      const syncCart = async () => {
        const savedCart = localStorage.getItem('guest_cart');
        
        if (savedCart) {
          try {
            const localItems: CartItem[] = JSON.parse(savedCart);
            
            // Verificar que localItems sea un array antes de usarlo
            if (Array.isArray(localItems)) {
              // Agregar items locales al backend
              for (const item of localItems) {
                try {
                  await addToCartApi(item.product.id, item.quantity);
                } catch (error) {
                  console.error('Error al sincronizar item:', error);
                }
              }
            }
            
            // Limpiar localStorage después de sincronizar
            localStorage.removeItem('guest_cart');
          } catch (error) {
            console.error('Error al parsear carrito local:', error);
          }
        }
        
        // Cargar carrito del backend
        refreshCart();
      };
      
      syncCart();
    } else {
      // Si no está autenticado, cargar desde localStorage
      const savedCart = localStorage.getItem('guest_cart');
      if (savedCart) {
        try {
          const parsedItems = JSON.parse(savedCart);
          // Verificar que parsedItems sea un array antes de establecerlo
          setCartItems(Array.isArray(parsedItems) ? parsedItems : []);
        } catch (error) {
          console.error('Error al cargar carrito local:', error);
          setCartItems([]);
        }
      } else {
        // Si no hay carrito guardado, asegurar array vacío
        setCartItems([]);
      }
    }
  }, [isAuthenticated, refreshCart]);

  // Guardar en localStorage si no está autenticado
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    try {
      if (isAuthenticated) {
        // Usuario autenticado: guardar en backend
        const newItem = await addToCartApi(productId, quantity);
        setCartItems(prev => {
          // Asegurar que prev sea un array
          const currentItems = Array.isArray(prev) ? prev : [];
          const existingIndex = currentItems.findIndex(item => item.product.id === productId);
          if (existingIndex >= 0) {
            const updated = [...currentItems];
            updated[existingIndex] = newItem;
            return updated;
          }
          return [...currentItems, newItem];
        });
      } else {
        // Usuario invitado: obtener info del producto y guardar localmente
        const productResponse = await http.get(`/productos/${productId}`);
        const product = productResponse.data;
        
        setCartItems(prev => {
          // Asegurar que prev sea un array
          const currentItems = Array.isArray(prev) ? prev : [];
          const existingIndex = currentItems.findIndex(item => item.product.id === productId);
          
          if (existingIndex >= 0) {
            // Si el producto ya existe, aumentar cantidad
            const updated = [...currentItems];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + quantity
            };
            return updated;
          } else {
            // Nuevo producto en el carrito
            const newItem: CartItem = {
              id: Date.now(), // ID temporal para items locales
              product: product,
              quantity: quantity
            };
            return [...currentItems, newItem];
          }
        });
      }
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const removeItem = useCallback(async (cartItemId: number) => {
    try {
      if (isAuthenticated) {
        await removeCartItem(cartItemId);
      }
      setCartItems(prev => {
        const currentItems = Array.isArray(prev) ? prev : [];
        return currentItems.filter(item => item.id !== cartItemId);
      });
    } catch (error) {
      console.error('Error al eliminar item:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    try {
      if (quantity === 0) {
        if (isAuthenticated) {
          await removeCartItem(cartItemId);
        }
        setCartItems(prev => {
          const currentItems = Array.isArray(prev) ? prev : [];
          return currentItems.filter(item => item.id !== cartItemId);
        });
        return;
      }

      if (isAuthenticated) {
        await updateCartItem(cartItemId, quantity);
      }
      
      setCartItems(prev => {
        const currentItems = Array.isArray(prev) ? prev : [];
        return currentItems.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
      });
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (!isAuthenticated) {
      localStorage.removeItem('guest_cart');
    }
  }, [isAuthenticated]);

  // Cálculos - con verificación adicional
  const itemCount = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    if (!Array.isArray(cartItems)) return 0;
    return cartItems.reduce((sum, item) => {
      const price = typeof item.product.precio === 'number' 
        ? item.product.precio 
        : Number.parseFloat(String(item.product.precio));
      return sum + price * item.quantity;
    }, 0);
  }, [cartItems]);

  const shipping = 0; // Envío gratis por ahora
  const total = subtotal + shipping;

  const value = useMemo<CartContextType>(() => ({
    cartItems: Array.isArray(cartItems) ? cartItems : [],
    itemCount,
    subtotal,
    total,
    loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
  }), [cartItems, itemCount, subtotal, total, loading, addToCart, updateQuantity, removeItem, clearCart, refreshCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}