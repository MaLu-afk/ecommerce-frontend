// src/admin/components/orders/OrderDetailModal.tsx
import { useEffect, useState } from 'react'
import { X, Clock } from 'lucide-react'
import { orderService } from '../../services/orderService'
import { useNotificationContext } from '../../context/NotificationContext'
import type { OrderStatus } from '../../types/order'

interface OrderDetail {
  id: number
  pedido_numero: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono?: string
  total: number
  fecha: string
  estado: string
  direccion_envio: string
  notas?: string
  productos: Array<{
    producto_id: number
    nombre: string
    cantidad: number
    precio: number
    subtotal: number
  }>
  timeline?: Array<{
    estado: OrderStatus
    fecha: string
  }>
}

interface OrderDetailModalProps {
  orderId: number
  onClose: () => void
}

export default function OrderDetailModal({ orderId, onClose }: OrderDetailModalProps) {
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const { addNotification } = useNotificationContext()

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await orderService.getById(orderId)
        if (response.success) {
          setOrder(response.data)
        } else {
          addNotification('error', 'Error', 'No se pudo cargar el detalle del pedido')
        }
      } catch (error) {
        console.error('Error al cargar detalle:', error)
        addNotification('error', 'Error', 'Ocurrió un error al cargar el detalle del pedido')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetail()
  }, [orderId, addNotification])

  // Función para obtener etiquetas en español
  const getEstadoLabel = (estado: string): string => {
    const labels: Record<string, string> = {
      pendiente: 'Pedido Pendiente',
      confirmado: 'Pedido Confirmado',
      enviado: 'Pedido Enviado',
      entregado: 'Pedido Entregado',
      cancelado: 'Pedido Cancelado'
    }
    return labels[estado] || estado
  }

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px' }}>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!order) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          padding: '2rem'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Detalle del Pedido {order.pedido_numero}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={24} color="#6b7280" />
          </button>
        </div>

        {/* Información del Cliente y Dirección */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Cliente */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Información del cliente
            </h3>
            <div style={{ fontSize: '0.875rem', lineHeight: '1.75' }}>
              <p><strong>Nombre:</strong> {order.cliente_nombre}</p>
              <p><strong>Email:</strong> {order.cliente_email}</p>
              {order.cliente_telefono && (
                <p><strong>Teléfono:</strong> {order.cliente_telefono}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
              Dirección de Envío
            </h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.75' }}>
              {order.direccion_envio || 'No especificada'}
            </p>
          </div>
        </div>

        {/* Productos */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Productos
          </h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>
                  Producto
                </th>
                <th style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: '600' }}>
                  Cantidad
                </th>
                <th style={{ padding: '12px', textAlign: 'right', fontSize: '0.875rem', fontWeight: '600' }}>
                  Precio
                </th>
              </tr>
            </thead>
            <tbody>
              {order.productos.map((producto, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '12px', fontSize: '0.875rem' }}>
                    {producto.nombre}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '0.875rem' }}>
                    {producto.cantidad}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', fontSize: '0.875rem' }}>
                    ${producto.precio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Historial de Estados */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
            Historial de Estados
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {order.timeline && order.timeline.length > 0 ? (
              order.timeline.map((item, index) => {
                const stateColors: Record<string, { bg: string; text: string }> = {
                  pendiente: { bg: '#fef3c7', text: '#f59e0b' },
                  confirmado: { bg: '#dbeafe', text: '#3b82f6' },
                  enviado: { bg: '#e0e7ff', text: '#6366f1' },
                  entregado: { bg: '#d1fae5', text: '#10b981' },
                  cancelado: { bg: '#fee2e2', text: '#ef4444' }
                }

                const colors = stateColors[item.estado] || { bg: '#f3f4f6', text: '#6b7280' }

                return (
                  <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: colors.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Clock size={20} color={colors.text} />
                    </div>
                    <div>
                      <p style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                        {getEstadoLabel(item.estado)} {/* Usar la función */}
                      </p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(item.fecha).toLocaleString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                No hay historial de estados disponible
              </p>
            )}
          </div>
        </div>

        {/* Notas */}
        {order.notas && (
          <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              Notas
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              {order.notas}
            </p>
          </div>
        )}

        {/* Total */}
        <div style={{
          borderTop: '2px solid #e5e7eb',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
            Total: ${order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}