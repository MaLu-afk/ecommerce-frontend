// src/pages/OrderSuccessPage.tsx
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function OrderSuccessPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Icono de éxito */}
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 p-6">
            <svg
              className="w-20 h-20 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-800 mb-4">
          ¡Pedido Realizado con Éxito!
        </h1>

        <p className="text-lg text-slate-600 mb-8">
          Tu pedido ha sido procesado y pagado correctamente. El administrador ha sido notificado
          y pronto comenzará a preparar tu envío.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-slate-800">Pago Procesado</p>
                <p className="text-sm text-slate-600">Tu pago ha sido confirmado automáticamente</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <p className="font-medium text-slate-800">Pedido Registrado</p>
                <p className="text-sm text-slate-600">El administrador puede ver tu pedido en el panel</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-slate-800">En Preparación</p>
                <p className="text-sm text-slate-600">Tu pedido será preparado próximamente</p>
              </div>
            </div>
          </div>
        </div>

                <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/my-orders')}
            className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors"
          >
            Ver Mis Pedidos
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors"
          >
            Volver al Inicio
          </button>
        </div>

      </div>
    </div>
  )
}
