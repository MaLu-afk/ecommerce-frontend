// src/pages/CheckoutPage.tsx
import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useAuth } from '../hooks/useAuth'
import { formatPriceUSD } from '../utils/formatPrice'
import { checkoutOrder, type CheckoutItem } from '../api/orders'

// ============================================================
// Helpers PaymentCardForm
// ============================================================

type CardFormProps = {
  onValidityChange?: (valid: boolean) => void
}

function onlyDigits(v: string) {
  return v.replace(/\D+/g, '')
}

function formatCardNumber(v: string) {
  const d = onlyDigits(v).slice(0, 16)
  return d.replace(/(.{4})/g, '$1 ').trim()
}

function luhnValid(num: string) {
  const n = onlyDigits(num)
  if (n.length < 13) return false
  let sum = 0
  let dbl = false
  for (let i = n.length - 1; i >= 0; i--) {
    let d = parseInt(n[i], 10)
    if (dbl) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    dbl = !dbl
  }
  return sum % 10 === 0
}

function formatExpiry(v: string) {
  const d = onlyDigits(v).slice(0, 4)
  if (d.length <= 2) return d
  return d.slice(0, 2) + '/' + d.slice(2)
}

function validExpiry(exp: string) {
  if (!/^\d{2}\/\d{2}$/.test(exp)) return false
  const [mmStr, yyStr] = exp.split('/')
  const mm = Number(mmStr)
  const yy = Number(yyStr)
  if (mm < 1 || mm > 12) return false

  const now = new Date()
  const curYY = Number(now.getFullYear().toString().slice(-2))
  const curMM = now.getMonth() + 1

  if (yy < curYY || yy > curYY + 15) return false
  if (yy === curYY && mm < curMM) return false
  return true
}

// ============================================================
// SUBCOMPONENTE: PaymentCardForm (simulado, sin cobro real)
// ============================================================

function PaymentCardForm({ onValidityChange }: CardFormProps) {
  const [cardNumber, setCardNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    const num = onlyDigits(cardNumber)

    // Solo valida longitud de 16 dígitos
    if (num.length !== 16) {
      e.cardNumber = 'La tarjeta debe tener 16 dígitos'
    }

    if (!name.trim()) e.name = 'Ingresa el titular'

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      e.expiry = 'Vencimiento inválido (MM/YY)'
    }

    const cvvDigits = onlyDigits(cvv)
    if (cvvDigits.length < 3 || cvvDigits.length > 4) e.cvv = 'CVV inválido'

    return e
  }, [cardNumber, name, expiry, cvv])

  const isValid = Object.keys(errors).length === 0

  useEffect(() => {
    onValidityChange?.(isValid)
  }, [isValid, onValidityChange])

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Número */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Número de tarjeta
          </label>
          <input
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.cardNumber
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-indigo-200'
            }`}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
          )}
        </div>

        {/* Titular */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Titular
          </label>
          <input
            autoComplete="cc-name"
            placeholder="ANA LOPEZ"
            value={name}
            onChange={(e) => setName(e.target.value.toUpperCase())}
            className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.name
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-indigo-200'
            }`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Vencimiento */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Vencimiento (MM/YY)
          </label>
          <input
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.expiry
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-indigo-200'
            }`}
          />
          {errors.expiry && (
            <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            CVV
          </label>
          <input
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            value={cvv}
            onChange={(e) => setCvv(onlyDigits(e.target.value).slice(0, 4))}
            className={`mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 ${
              errors.cvv
                ? 'border-red-300 focus:ring-red-200'
                : 'border-slate-300 focus:ring-indigo-200'
            }`}
          />
          {errors.cvv && (
            <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// PÁGINA DE CHECKOUT
// ============================================================

type LocationData = {
  [departamento: string]: {
    [provincia: string]: string[]
  }
}

// 2 departamentos, 2 provincias y 5 distritos en total (ejemplo)
const LOCATION_DATA: LocationData = {
  Lima: {
    Lima: ['San Miguel', 'Miraflores', 'Surco', 'La Molina', 'SMP'],
  },
  Callao: {
    Callao: ['Bellavista', 'La Perla'],
  },
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, total, subtotal, clearCart } = useCart()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentValid, setPaymentValid] = useState(false)

  // Dirección de envío
  const [addressLine, setAddressLine] = useState('')
  const [department, setDepartment] = useState('')
  const [province, setProvince] = useState('')
  const [district, setDistrict] = useState('')
  const [reference, setReference] = useState('')

  const departmentOptions = Object.keys(LOCATION_DATA)

  const provinceOptions = useMemo(() => {
    if (!department) return []
    return Object.keys(LOCATION_DATA[department] || {})
  }, [department])

  const districtOptions = useMemo(() => {
    if (!department || !province) return []
    return LOCATION_DATA[department]?.[province] || []
  }, [department, province])

  const shippingValid = useMemo(
    () =>
      addressLine.trim().length >= 5 &&
      !!department &&
      !!province &&
      !!district,
    [addressLine, department, province, district],
  )

  const handleConfirmOrder = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mapear cartItems al formato esperado por el backend
      const items: CheckoutItem[] = cartItems.map((item) => {
        const rawPrice =
          typeof item.product.precio === 'number'
            ? item.product.precio
            : Number.parseFloat(String(item.product.precio))

        return {
          producto_id: item.product.id,
          cantidad: item.quantity,
          precio_unitario: rawPrice,
        }
      })

      const shippingAddress = {
        nombre: user?.nombre,
        email: user?.email,
        departamento: department,
        provincia: province,
        distrito: district,
        addressLine,
        reference,
      }

      await checkoutOrder({
        items,
        shipping: shippingAddress,
        total, // opcional, si tu backend lo usa
      })

      clearCart()
      navigate('/order-success')
    } catch (err: any) {
      console.error('Error al crear el pedido:', err)
      const apiMsg =
        err?.response?.data?.message ??
        (err?.response?.data?.errors &&
          JSON.stringify(err.response.data.errors)) ??
        'Hubo un error al procesar tu pedido. Por favor intenta de nuevo.'
      setError(apiMsg)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
          Tu carrito está vacío
        </h2>
        <button
          onClick={() => navigate('/productos')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Ver Productos
        </button>
      </div>
    )
  }

  const shipping = 0 // Envío gratis (por ahora no usado, pero lo dejamos)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Información de envío */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Información de Envío
            </h2>

            {/* Datos del usuario */}
            <div className="space-y-3 text-sm mb-6">
              <div>
                <span className="font-medium text-slate-700">Nombre:</span>
                <span className="ml-2 text-slate-600">{user?.nombre}</span>
              </div>
              <div>
                <span className="font-medium text-slate-700">Email:</span>
                <span className="ml-2 text-slate-600">{user?.email}</span>
              </div>
            </div>

            {/* Dirección / ubicación */}
            <div className="space-y-4">
              {/* Dirección completa */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Dirección completa
                </label>
                <input
                  type="text"
                  placeholder="Av. Ejemplo 123, Torre A, Depto 402"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {/* Departamento */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Departamento
                </label>
                <select
                  value={department}
                  onChange={(e) => {
                    const value = e.target.value
                    setDepartment(value)
                    setProvince('')
                    setDistrict('')
                  }}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-white"
                >
                  <option value="">Selecciona un departamento</option>
                  {departmentOptions.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              {/* Provincia */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Provincia
                </label>
                <select
                  value={province}
                  onChange={(e) => {
                    const value = e.target.value
                    setProvince(value)
                    setDistrict('')
                  }}
                  disabled={!department}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">
                    {department
                      ? 'Selecciona una provincia'
                      : 'Selecciona primero un departamento'}
                  </option>
                  {provinceOptions.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              {/* Distrito */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Distrito
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  disabled={!province}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-white disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">
                    {province
                      ? 'Selecciona un distrito'
                      : 'Selecciona primero una provincia'}
                  </option>
                  {districtOptions.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Referencia */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Referencia (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Frente al parque, casa azul, etc."
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>

              {!shippingValid && (
                <p className="text-xs text-red-600">
                  Completa la dirección, departamento, provincia y distrito para
                  poder continuar.
                </p>
              )}
            </div>
          </div>

          {/* Resumen de productos */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Resumen de Productos
            </h2>
            <div className="space-y-4">
              {cartItems.map((item) => {
                const price =
                  typeof item.product.precio === 'number'
                    ? item.product.precio
                    : Number.parseFloat(String(item.product.precio))

                const imageSrc =
                  (Array.isArray((item.product as any).imagen_url) &&
                    (item.product as any).imagen_url[0]) ||
                  (item.product as any).imagen ||
                  '/placeholder.png'

                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                  >
                    <img
                      src={imageSrc}
                      alt={item.product.nombre}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-800">
                        {item.product.nombre}
                      </h3>
                      <p className="text-sm text-slate-600">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-800">
                        {formatPriceUSD(price * item.quantity)}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatPriceUSD(price)} c/u
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Método de pago simulado */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Método de Pago
            </h2>

            <PaymentCardForm onValidityChange={setPaymentValid} />
          </div>
        </div>

        {/* Resumen de compra */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-4">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">
              Resumen de Compra
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">{formatPriceUSD(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Costo de envío:</span>
                <span className="font-medium text-green-600">Gratis</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total:</span>
                <span>{formatPriceUSD(total)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleConfirmOrder}
              disabled={loading || !paymentValid || !shippingValid}
              className="mt-6 w-full rounded-lg bg-purple-600 px-4 py-3 text-white font-medium hover:bg-purple-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>

            <button
              onClick={() => navigate('/cart')}
              disabled={loading}
              className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Volver al Carrito
            </button>

            <div className="mt-6 pt-4 border-t text-xs text-slate-500 space-y-1">
              <p>✓ Envío gratis en todos los pedidos</p>
              <p>✓ Procesamiento automático de pago</p>
              <p>✓ Tu pedido será visible para el administrador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
