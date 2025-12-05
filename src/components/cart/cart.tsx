import { useNavigate } from 'react-router-dom'
import CartItem from './CartItem'
import CartSummary from './CartSummary'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../hooks/useAuth'
import { CartRecommendations } from '../recommendations/CartRecommendations'

export default function CartPage() {
  const navigate = useNavigate()
  const { cartItems, itemCount, subtotal, total, loading, updateQuantity, removeItem } = useCart()
  const { isAuthenticated } = useAuth()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Si no está autenticado, redirigir a login con returnUrl
      navigate('/login?returnUrl=/checkout')
    } else {
      // Si está autenticado, ir al checkout
      navigate('/checkout')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Cargando carrito...</div>
  }

  const shipping = 0 // Envío gratis

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Carrito de Compras</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600 text-lg mb-4">Tu carrito está vacío</p>
          <button
            onClick={() => navigate('/productos')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Ver Productos
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={(quantity) => updateQuantity(item.id, quantity)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </div>

            <div className="lg:col-span-1">
              <CartSummary
                itemCount={itemCount}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                onCheckout={handleCheckout}
              />
            </div>
          </div>

          {/* Sección de recomendaciones */}
          <div className="mt-12">
            <CartRecommendations />
          </div>
        </>
      )}
    </div>
  )
}