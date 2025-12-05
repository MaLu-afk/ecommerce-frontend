// src/admin/components/orders/OrderActions.tsx
import { useState, useRef, useEffect } from 'react'
import { Eye, MoreVertical } from 'lucide-react'
import type { Order, OrderStatus } from '../../types/order'

interface OrderActionsProps {
  order: Order
  onViewDetails: (order: Order) => void
  onChangeStatus: (orderId: number, newStatus: OrderStatus) => void
}

export default function OrderActions({ 
  order, 
  onViewDetails, 
  onChangeStatus 
}: OrderActionsProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  // Determinar estados permitidos según estado actual
  const getAvailableStatuses = (): { status: OrderStatus; label: string }[] => {
    switch (order.estado) {
      case 'pendiente':
        return [
          { status: 'confirmado', label: 'Confirmar' },
          { status: 'cancelado', label: 'Cancelar' }
        ]
      case 'confirmado':
        return [
          { status: 'enviado', label: 'Marcar como Enviado' },
          { status: 'cancelado', label: 'Cancelar' }
        ]
      case 'enviado':
        return [
          { status: 'entregado', label: 'Marcar como Entregado' }
        ]
      default:
        return []
    }
  }

  const availableStatuses = getAvailableStatuses()

  const handleStatusChange = (newStatus: OrderStatus) => {
    onChangeStatus(order.id, newStatus)
    setShowMenu(false)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', width: '100%' }}>
      {/* Botón Ver Detalles */}
      <button
        onClick={() => onViewDetails(order)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
        title="Ver detalles"
      >
        <Eye size={20} color="#6b7280" />
      </button>

      {/* Botón Cambiar Estado (solo si hay opciones disponibles) */}
      {availableStatuses.length > 0 && (
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button
            ref={buttonRef}
            onClick={() => setShowMenu(!showMenu)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Cambiar estado"
          >
            <MoreVertical size={20} color="#6b7280" />
          </button>

          {/* Menú desplegable */}
          {showMenu && (
            <>
              {/* Fondo semitransparente para cerrar al hacer click fuera */}
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9998,
                  background: 'transparent'
                }}
                onClick={() => setShowMenu(false)}
              />
              
              {/* Menú flotante posicionado exactamente debajo del botón */}
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'white',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  marginTop: '4px',
                  padding: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  zIndex: 9999,
                  minWidth: '180px'
                }}
              >
                {availableStatuses.map(({ status, label }) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      marginBottom: '4px', 
                      display: 'block' 
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f3f4f6'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}