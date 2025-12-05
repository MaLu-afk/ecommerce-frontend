// src/admin/components/orders/OrderTable.tsx
import { useState, useEffect, lazy, Suspense } from 'react'
import { DataTable } from '../shared/DataTable'
import type { Column } from '../shared/DataTable'
import { StatusBadge } from '../shared/StatusBadge'
import { ConfirmModal } from '../shared/ConfirmModal'
import { useNotificationContext } from '../../context/NotificationContext'
import { useOrders } from '../../hooks/useOrders'
import { usePagination } from '../../hooks/useAdminForm'
import type { Order, OrderStatus, DateFilter } from '../../types/order'
import { ModalLoading } from '../shared/AdminLoading'

// Lazy loading de componentes de pedidos
const OrderActions = lazy(() => import('./OrderActions'));
const OrderDetailModal = lazy(() => import('./OrderDetailModal'));

interface OrderTableProps {}

export default function OrderTable({}: OrderTableProps) {
  const [statusFilterOpen, setStatusFilterOpen] = useState(false)
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    orderId: number | null
    newStatus: OrderStatus | null
    message: string
  }>({
    isOpen: false,
    orderId: null,
    newStatus: null,
    message: ''
  })

  // Hook de notificaciones
  const { addNotification } = useNotificationContext()

  const {
    orders,
    loading,
    error,
    filters,
    setFilters,
    updateOrderStatus,
    clearError,
    refreshOrders
  } = useOrders()

  const {
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
    nextPage,
    prevPage,
    resetPage
  } = usePagination({
    totalItems: orders.length,
    itemsPerPage: 8
  })

  const currentOrders = orders.slice(startIndex, endIndex)

  useEffect(() => {
    resetPage()
  }, [orders.length, resetPage])

  const handleStatusChange = (status: OrderStatus | 'todos') => {
    setFilters({ ...filters, estado: status })
    setStatusFilterOpen(false)
  }

  const handleDateChange = (fecha: DateFilter) => {
    setFilters({ ...filters, fecha })
    setDateFilterOpen(false)
  }

  const handleViewDetails = (order: Order) => {
    console.log('Abriendo modal para pedido:', order.id)
    setSelectedOrderId(order.id)
  }

  const handleCloseModal = () => {
    console.log('Cerrando modal')
    setSelectedOrderId(null)
  }

  const handleChangeStatus = (orderId: number, newStatus: OrderStatus) => {
    setConfirmModal({
      isOpen: true,
      orderId,
      newStatus,
      message: `¿Cambiar el estado del pedido a "${newStatus}"?`
    })
  }

  const handleConfirmStatusChange = async () => {
    if (!confirmModal.orderId || !confirmModal.newStatus) return

    try {
      const success = await updateOrderStatus(confirmModal.orderId, confirmModal.newStatus)
      if (success) {
        addNotification('success', 'Estado actualizado', 'El estado del pedido se actualizó correctamente')
        await refreshOrders() // Actualizar la tabla
      } else {
        addNotification('error', 'Error', 'No se pudo actualizar el estado del pedido')
      }
    } catch (error: any) {
      addNotification('error', 'Error inesperado', 'Ocurrió un error al actualizar el estado')
    } finally {
      setConfirmModal({ isOpen: false, orderId: null, newStatus: null, message: '' })
    }
  }

  const columns: Column<Order>[] = [
    {
      key: 'pedido_numero',
      label: 'Pedido',
      width: '140px',
      render: (pedido: string) => (
        <div style={{
          fontWeight: '600',
          textAlign: 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {pedido}
        </div>
      )
    },
    {
      key: 'productos_cantidad',
      label: 'Productos',
      width: '100px',
      alignHeader: 'center',
      render: (cantidad: number) => (
        <div style={{
          whiteSpace: 'nowrap',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {cantidad}
        </div>
      )
    },
    {
      key: 'total',
      label: 'Total',
      width: '120px',
      alignHeader: 'center',
      render: (total: number) => (
        <div style={{
          textAlign: 'right',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          ${total.toFixed(2)}
        </div>
      )
    },
    {
      key: 'fecha',
      label: 'Fecha',
      width: '130px',
      render: (fecha: string) => {
        const date = new Date(fecha)
        return (
          <div style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {date.toLocaleDateString('es-ES')}
          </div>
        )
      }
    },
    {
      key: 'estado',
      label: 'Estado',
      width: '150px',
      alignHeader: 'center',
      render: (estado: OrderStatus) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          <StatusBadge status={estado} variant="order" />
        </div>
      )
    }
  ]

  const estadoLabels: Record<OrderStatus | 'todos', string> = {
    todos: 'Todos',
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    enviado: 'Enviado',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
  }

  const fechaLabels: Record<DateFilter, string> = {
    todos: 'Todas las fechas',
    hoy: 'Hoy',
    semana: 'Esta semana',
    mes: 'Este mes'
  }

  if (error && orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
        <p>{error}</p>
        <button 
          onClick={clearError}
          style={{ 
            background: '#dc2626', 
            color: 'white', 
            border: 'none', 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            marginTop: '1rem', 
            cursor: 'pointer' 
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1230px', margin: '0 auto', padding: '0 1rem', width: '80%' }}>
      <h1 style={{ color: '#444649ff', fontFamily: 'Protest Strike', fontSize: '28px' }}>
        Gestión de Pedidos
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '1rem', fontFamily: 'Poppins' }}>
        Lista de pedidos
      </p>
      
      <div style={{
        background: '#f4f4f5',
        padding: '20px',
        borderRadius: '12px',
        overflowX: 'auto',
        overflowY: 'visible',
        position: 'relative',
        maxWidth: '100%',
        minWidth: '800px' 
      }}>
        
        {/* Filtros */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          
          {/* Filtro por Estado */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setStatusFilterOpen(!statusFilterOpen)}
              style={{ 
                background: '#a6a6a7ff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                minWidth: '120px',
                minHeight: '35px'
              }}
            >
              Estado ({estadoLabels[filters.estado]})
            </button>

            {statusFilterOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '140px'
              }}>
                {(['todos', 'pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'] as const).map(status => (
                  <label key={status} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={filters.estado === status}
                      onChange={() => handleStatusChange(status)}
                      style={{ marginRight: '6px' }}
                    />
                    {estadoLabels[status]}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Filtro por Fecha */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDateFilterOpen(!dateFilterOpen)}
              style={{ 
                background: '#a6a6a7ff',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                minWidth: '120px',
                minHeight: '35px'
              }}
            >
              Fecha ({fechaLabels[filters.fecha]})
            </button>

            {dateFilterOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                background: 'white',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                marginTop: '8px',
                padding: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                zIndex: 1000,
                minWidth: '150px'
              }}>
                {(['todos', 'hoy', 'semana', 'mes'] as const).map(fecha => (
                  <label key={fecha} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="fecha"
                      value={fecha}
                      checked={filters.fecha === fecha}
                      onChange={() => handleDateChange(fecha)}
                      style={{ marginRight: '6px' }}
                    />
                    {fechaLabels[fecha]}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ 
            background: '#fef3c7', 
            color: '#92400e', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>{error}</span>
            <button 
              onClick={clearError}
              style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        )}

        <DataTable
          data={currentOrders}
          columns={columns}
          loading={loading}
          emptyMessage="No hay pedidos para mostrar"
          customActions={(order: Order) => (
            <Suspense fallback={<div style={{ width: '80px', textAlign: 'center' }}>...</div>}>
              <OrderActions
                order={order}
                onViewDetails={handleViewDetails}
                onChangeStatus={handleChangeStatus}
              />
            </Suspense>
          )}
        />
      </div>

      {totalPages > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center', 
          gap: '10px', 
          marginTop: '20px' 
        }}>
          <button
            disabled={!hasPrev}
            onClick={prevPage}
            style={{ 
              background: !hasPrev ? '#d1d5db' : '#3B001E', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              cursor: !hasPrev ? 'not-allowed' : 'pointer' 
            }}
          >
            ←
          </button>
          <span style={{ color: '#374151' }}>
            Página {currentPage} de {totalPages}
          </span>
          <button
            disabled={!hasNext}
            onClick={nextPage}
            style={{ 
              background: !hasNext ? '#d1d5db' : '#3B001E', 
              color: 'white', 
              border: 'none', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              cursor: !hasNext ? 'not-allowed' : 'pointer' 
            }}
          >
            →
          </button>
        </div>
      )}

      {/* Modal de Detalle */}
      {selectedOrderId && (
        <Suspense fallback={<ModalLoading />}>
          <OrderDetailModal
            orderId={selectedOrderId}
            onClose={handleCloseModal}
          />
        </Suspense>
      )}

      {/* Modal de Confirmación para Cambio de Estado */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirmStatusChange}
        title="Confirmar cambio de estado"
        message={confirmModal.message}
        confirmText="Sí, cambiar"
        cancelText="Cancelar"
        type="info"
      />
    </div>
  )
}