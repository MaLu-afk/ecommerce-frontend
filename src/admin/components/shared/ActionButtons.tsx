// admin/components/shared/ActionButtons.tsx
import React from 'react'
import { Edit, Trash2, Copy, Eye, MoreHorizontal } from 'lucide-react'

interface ActionButton {
  type: 'edit' | 'delete' | 'duplicate' | 'view' | 'custom'
  onClick: () => void
  disabled?: boolean
  tooltip?: string
  icon?: React.ReactNode
  label?: string
  className?: string
}

interface ActionButtonsProps {
  actions: ActionButton[]
  layout?: 'horizontal' | 'dropdown'
  size?: 'small' | 'medium' | 'large'
  className?: string
}

// Componente para agrupar los botones de acción de cada fila
export function ActionButtons({
  actions,
  layout = 'horizontal',
  size = 'medium',
  className = ""
}: ActionButtonsProps) {
  
  // Función para obtener el ícono por defecto según el tipo
  const getDefaultIcon = (type: ActionButton['type']) => {
    const iconSize = size === 'small' ? 14 : size === 'large' ? 18 : 16
    
    switch (type) {
      case 'edit':
        return <Edit size={iconSize} />
      case 'delete':
        return <Trash2 size={iconSize} />
      case 'duplicate':
        return <Copy size={iconSize} />
      case 'view':
        return <Eye size={iconSize} />
      default:
        return null
    }
  }

  // Función para obtener la clase CSS por defecto según el tipo
  const getDefaultClassName = (type: ActionButton['type']) => {
    const baseClass = `action-btn action-btn-${size}`
    
    switch (type) {
      case 'edit':
        return `${baseClass} action-edit`
      case 'delete':
        return `${baseClass} action-delete`
      case 'duplicate':
        return `${baseClass} action-duplicate`
      case 'view':
        return `${baseClass} action-view`
      case 'custom':
        return `${baseClass} action-custom`
      default:
        return baseClass
    }
  }

  // Función para obtener el tooltip por defecto
  const getDefaultTooltip = (type: ActionButton['type']) => {
    switch (type) {
      case 'edit':
        return 'Editar'
      case 'delete':
        return 'Eliminar'
      case 'duplicate':
        return 'Duplicar'
      case 'view':
        return 'Ver detalles'
      default:
        return ''
    }
  }

  // Renderizar botón individual
  const renderButton = (action: ActionButton, index: number) => {
    const icon = action.icon || getDefaultIcon(action.type)
    const tooltip = action.tooltip || getDefaultTooltip(action.type)
    const btnClassName = action.className || getDefaultClassName(action.type)

    return (
      <button
        key={index}
        onClick={action.onClick}
        disabled={action.disabled}
        className={btnClassName}
        title={tooltip}
        type="button"
      >
        {icon}
        {action.label && (
          <span className="action-label">{action.label}</span>
        )}
      </button>
    )
  }

  // Layout horizontal - botones uno al lado del otro
  if (layout === 'horizontal') {
    return (
      <div className={`action-buttons-horizontal ${className}`}>
        {actions.map((action, index) => renderButton(action, index))}
      </div>
    )
  }

  // Layout dropdown - para cuando hay muchas acciones
  return (
    <div className={`action-buttons-dropdown ${className}`}>
      <button className="action-btn action-btn-more">
        <MoreHorizontal size={16} />
      </button>
      {/* Aquí iría el dropdown menu si lo necesitamos */}
    </div>
  )
}

// Hook helper para crear acciones comunes rápidamente
export function useCommonActions() {
  const createEditAction = (onEdit: () => void, disabled = false): ActionButton => ({
    type: 'edit',
    onClick: onEdit,
    disabled
  })

  const createDeleteAction = (onDelete: () => void, disabled = false): ActionButton => ({
    type: 'delete', 
    onClick: onDelete,
    disabled
  })

  const createDuplicateAction = (onDuplicate: () => void, disabled = false): ActionButton => ({
    type: 'duplicate',
    onClick: onDuplicate,
    disabled
  })

  const createViewAction = (onView: () => void, disabled = false): ActionButton => ({
    type: 'view',
    onClick: onView,
    disabled
  })

  return {
    createEditAction,
    createDeleteAction,
    createDuplicateAction,
    createViewAction
  }
}

// Componente específico para las acciones más comunes (edit, duplicate, delete)
interface QuickActionsProps<T> {
  item: T
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onDuplicate?: (item: T) => void
  canDuplicate?: (item: T) => boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function QuickActions<T>({
  item,
  onEdit,
  onDelete,
  onDuplicate,
  canDuplicate,
  size = 'medium',
  className = ""
}: QuickActionsProps<T>) {
  const { createEditAction, createDeleteAction, createDuplicateAction } = useCommonActions()

  const actions: ActionButton[] = []

  // Agregar acción de editar si está disponible
  if (onEdit) {
    actions.push(createEditAction(() => onEdit(item)))
  }

  // Agregar acción de duplicar si está disponible y permitida
  if (onDuplicate) {
    const disabled = canDuplicate ? !canDuplicate(item) : false
    actions.push(createDuplicateAction(() => onDuplicate(item), disabled))
  }

  // Agregar acción de eliminar si está disponible
  if (onDelete) {
    actions.push(createDeleteAction(() => onDelete(item)))
  }

  return (
    <ActionButtons
      actions={actions}
      size={size}
      className={className}
    />
  )
}