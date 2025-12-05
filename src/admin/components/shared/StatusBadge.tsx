// src/admin/components/shared/StatusBadge.tsx
interface StatusBadgeProps {
  status: string
  variant?: 'default' | 'product' | 'order' | 'custom'
  className?: string
}

const productStatusConfig = {
  'publicado': {
    label: 'Publicado',
    className: 'status-published'
  },
  'borrador': {
    label: 'Borrador', 
    className: 'status-draft'
  },
  'oculto': {
    label: 'Oculto',
    className: 'status-hidden'
  },
  'agotado': {
    label: 'Agotado',
    className: 'status-out-of-stock'
  }
}

const orderStatusConfig = {
  'pendiente': {
    label: 'Pendiente',
    className: 'status-pending'
  },
  'confirmado': {
    label: 'Confirmado',
    className: 'status-processing'
  },
  'enviado': {
    label: 'Enviado',
    className: 'status-shipped'
  },
  'entregado': {
    label: 'Entregado',
    className: 'status-delivered'
  },
  'cancelado': {
    label: 'Cancelado',
    className: 'status-cancelled'
  }
}

export function StatusBadge({
  status,
  variant = 'default',
  className = ""
}: StatusBadgeProps) {
  
  const getStatusConfig = () => {
    const normalizedStatus = status?.toLowerCase() || ''
    
    switch (variant) {
      case 'product':
        return productStatusConfig[normalizedStatus as keyof typeof productStatusConfig]
      case 'order':
        return orderStatusConfig[normalizedStatus as keyof typeof orderStatusConfig]
      default:
        return {
          label: status,
          className: `status-${normalizedStatus.replace(/\s+/g, '-')}`
        }
    }
  }

  const config = getStatusConfig()
  const displayLabel = config?.label || status || 'Sin estado'
  const statusClass = config?.className || 'status-default'

  return (
    <span className={`status-badge ${statusClass} ${className}`}>
      {displayLabel}
    </span>
  )
}

export type ProductStatus = keyof typeof productStatusConfig
export type OrderStatus = keyof typeof orderStatusConfig