// dsw-front-react/src/components/cart/CartItem.tsx
import type { CartItem } from '../../types/productCart'
import { formatPriceUSD } from '../../utils/formatPrice'

interface CartItemProps {
  item: CartItem
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  const { product, quantity } = item
  const subtotal = (typeof product.precio === 'number' ? product.precio : parseFloat(product.precio as string)) * quantity

  const imgs = Array.isArray(product.imagen_url)
    ? product.imagen_url.filter(Boolean)
    : (product.imagen_url ? [product.imagen_url] : [])

  const cover = imgs[0] ?? '/placeholder.png'

  const isOutOfStock = product.stock === 0

  return (
    <article className={`flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}>
      {/* Imagen */}
      <div className="aspect-square w-24 overflow-hidden rounded-lg bg-slate-50">
        {cover ? (
          <img
            src={cover}
            alt={product.nombre}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-400 text-sm">
            Sin imagen
          </div>
        )}
      </div>

      {/* Detalles */}
      <div className="flex-1 space-y-2">
        <h3 className="text-lg font-semibold text-slate-800">{product.nombre}</h3>
        {product.descripcion && (
          <p className="text-sm text-slate-600 line-clamp-2">{product.descripcion}</p>
        )}
        {product.especificaciones && (
          <div className="text-xs text-slate-500">
            {product.especificaciones.caracteristicas_principales && (
              <div>
                {Object.entries(product.especificaciones.caracteristicas_principales).map(([key, value]) => (
                  <span key={key} className="mr-2">{key}: {value}</span>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="text-lg font-bold text-slate-900">{formatPriceUSD(product.precio)}</div>
      </div>

      {/* Cantidad y Subtotal */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Cantidad:</label>
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50"
            disabled={isOutOfStock || quantity <= 1}
          >
            -
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
            className="w-8 h-8 rounded border border-slate-300 flex items-center justify-center hover:bg-slate-50"
            disabled={isOutOfStock || quantity >= product.stock}
          >
            +
          </button>
          <button
            onClick={onRemove}
            className="text-red-500 hover:text-red-700 ml-2"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <div className="text-lg font-bold text-slate-900">Subtotal: {formatPriceUSD(subtotal)}</div>
      </div>
    </article>
  )
}