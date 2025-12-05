// admin/components/shared/FormModal.tsx
import React from 'react'
import { X } from 'lucide-react'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
  submitText?: string
  cancelText?: string
  isSubmitting?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

// Modal genérico que podemos usar para productos, categorías, etc.
export function FormModal({
  isOpen,
  onClose,
  title,
  onSubmit,
  children,
  submitText = "Guardar",
  cancelText = "Cancelar", 
  isSubmitting = false,
  size = 'medium',
  className = ""
}: FormModalProps) {
  
  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null

  // Función para manejar clics en el overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    // Solo cerramos si hacen clic en el overlay, no en el contenido del modal
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Función para manejar el escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Clases para el tamaño del modal
  const sizeClasses = {
    small: 'modal-content-small',
    medium: 'modal-content-medium', 
    large: 'modal-content-large'
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content ${sizeClasses[size]} ${className}`}>
        {/* Header del modal */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="modal-close-btn"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="modal-form">
          {/* Contenido del formulario */}
          <div className="modal-body">
            {children}
          </div>

          {/* Botones de acción */}
          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={isSubmitting}
            >
              {cancelText}
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="btn-spinner"></span>
                  Guardando...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}