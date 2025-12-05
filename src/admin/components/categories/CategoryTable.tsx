// admin/components/categories/CategoryTable.tsx
import { useState, lazy, Suspense } from 'react'
import { DataTable } from '../shared/DataTable'
import { ConfirmModal } from '../shared/ConfirmModal'
import { useNotificationContext } from '../../context/NotificationContext'
import { useCategories } from '../../hooks/useCategories'
import { ModalLoading } from '../shared/AdminLoading'

// Lazy loading del formulario de categoría
const CategoryForm = lazy(() => import('./CategoryForm'));

interface Category {
  id: number
  nombre: string
  caracteristicas: string
  plantilla_detalles: {
    caracteristicas_principales?: { [key: string]: string }
    otros?: { [key: string]: string }
  } | null
}

export default function CategoryTable() {
  // Estados del modal
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    action: 'delete' | null
    category: Category | null
    message: string
  }>({
    isOpen: false,
    action: null,
    category: null,
    message: ''
  })

  // Hook de notificaciones
  const { addNotification } = useNotificationContext()

  // Usar hook para manejar toda la lógica de categorías
  const {
    categories,
    loading,
    error,
    deleteCategory,
    refreshCategories,
    clearError,
  } = useCategories()

  // Funciones de manejo simplificadas
  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setShowModal(true)
  }

  const handleDelete = (category: Category) => {
    setConfirmModal({
      isOpen: true,
      action: 'delete',
      category,
      message: `¿Estás seguro de que quieres eliminar la categoría "${category.nombre}"? Esta acción no se puede deshacer.`
    })
  }

  const handleConfirmAction = async () => {
    if (!confirmModal.category || !confirmModal.action) return

    try {
      let success = false
      
      if (confirmModal.action === 'delete') {
        success = await deleteCategory(confirmModal.category.id)
        if (success) {
          addNotification('success', 'Categoría eliminada', 'La categoría se eliminó correctamente')
          await refreshCategories() // Actualizar la tabla
        } else {
          addNotification('error', 'Error', 'No se pudo eliminar la categoría')
        }
      }

      // Cerrar el modal de confirmación
      setConfirmModal({ isOpen: false, action: null, category: null, message: '' })
      
    } catch (error: any) {
      addNotification('error', 'Error inesperado', 'Ocurrió un error inesperado')
    }
  }

  const handleFormSubmit = async (success: boolean) => {
    if (success) {
      setShowModal(false)
      setEditingCategory(null)
      await refreshCategories() // Actualizar la tabla
      addNotification('success', 'Categoría guardada', 'Los cambios se guardaron correctamente')
    } else {
      addNotification('error', 'Error', 'No se pudo guardar la categoría')
    }
  }

  // Configuración de columnas para la tabla
  const columns = [
    {
      key: 'nombre',
      label: 'Nombre de la Categoría',
      width: '190px',
      headerStyle: { padding: '8px 12px' },
      render: (nombre: string) => (
        <div style={{ padding: '8px 12px', fontWeight: '500', color: '#374151' }}>
          {nombre}
        </div>
      )
    },
    {
      key: 'caracteristicas',
      label: 'Descripción',
      width: '200px',
      headerStyle: { padding: '8px 12px' },
      render: (caracteristicas: string) => (
        <div
          title={caracteristicas || 'Sin descripción'}
          style={{
            padding: '8px 12px',
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            cursor: 'default'
          }}
        >
          {caracteristicas ? (
            caracteristicas
          ) : (
            <span style={{ fontStyle: 'italic', color: '#9ca3af' }}>
              Sin descripción
            </span>
          )}
        </div>
      )
    }
  ]

  // Mostrar error si hay y no hay categorías
  if (error && categories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
        <p>{error}</p>
        <button 
          onClick={() => {
            clearError()
            refreshCategories()
          }} 
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
    <div style={{ 
      maxWidth: '700px', 
      margin: '0 auto', 
      width: '100%'
    }}>
      <div>
        <h1 style={{ color: '#444649ff', fontFamily: 'Protest Strike', fontSize: '28px' }}>Gestión de Categorías</h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem', fontFamily: 'Poppins' }}>Lista de categorías</p>
      </div>
      
      <div style={{ 
        background: '#f4f4f5', 
        padding: '20px', 
        borderRadius: '12px',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        
        {error && (
          <div style={{ 
            background: '#fef3c7', 
            color: '#92400e', 
            padding: '12px', 
            borderRadius: '6px', 
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>{error}</span>
            <button 
              onClick={clearError}
              style={{ background: 'none', border: 'none', color: '#92400e', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              ×
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button
            onClick={() => setShowModal(true)}
            style={{ 
              background: '#5c0d32', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer' 
            }}
          >
            Agregar Categoría
          </button>
        </div>

        <div style={{ 
          width: '600px',        
          maxWidth: '100%',      
          margin: '0 auto',   
          background: '#f4f4f5', 
          borderRadius: '12px'
        }}>
          <DataTable
            data={categories}
            columns={columns}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            emptyMessage="No hay categorías creadas"
          />
        </div>

        {showModal && (
          <Suspense fallback={<ModalLoading />}>
            <CategoryForm
              isOpen={showModal}
              onClose={() => {
                setShowModal(false)
                setEditingCategory(null)
              }}
              onSubmit={handleFormSubmit}
              editingCategory={editingCategory}
            />
          </Suspense>
        )}

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={handleConfirmAction}
          title="Confirmar acción"
          message={confirmModal.message}
          confirmText="Sí, continuar"
          cancelText="Cancelar"
          type="warning"
        />
      </div>
    </div>
  )
}