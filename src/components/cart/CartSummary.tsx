import { formatPriceUSD } from '../../utils/formatPrice'

interface CartSummaryProps {
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  onCheckout: () => void
}

export default function CartSummary({ itemCount, subtotal, shipping, total, onCheckout }: CartSummaryProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">Resumen de Compra</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Número de productos:</span>
          <span className="font-medium">{itemCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Subtotal:</span>
          <span className="font-medium">{formatPriceUSD(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-600">Costo de envío:</span>
          <span className="font-medium">{formatPriceUSD(shipping)}</span>
        </div>
        <hr className="my-3" />
        <div className="flex justify-between text-lg font-bold text-slate-900">
          <span>Total:</span>
          <span>{formatPriceUSD(total)}</span>
        </div>
      </div>
      <button 
        onClick={onCheckout}
        className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 text-white font-medium hover:bg-purple-700 transition-colors"
      >
        Proceder al Pago
      </button>
    </div>
  )
}