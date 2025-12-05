// admin/components/products/ProductTable.tsx
import { useState, useEffect, lazy, Suspense } from 'react'
import { Image as LucideImage } from 'lucide-react'
import { DataTable } from '../shared/DataTable'
import type { Column } from '../shared/DataTable'
import { StatusBadge } from '../shared/StatusBadge'
import { ConfirmModal } from '../shared/ConfirmModal'
import { useProducts } from '../../hooks/useProducts'
import { useCategories } from '../../hooks/useCategories'
import { usePagination } from '../../hooks/useAdminForm'
import { useNotificationContext } from '../../context/NotificationContext'
import { ModalLoading } from '../shared/AdminLoading'

// Lazy loading del formulario de producto
const ProductForm = lazy(() => import('./ProductForm'));

interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precio: string | number
  stock: number
  admin_id: number
  imagen_url: string[]
  categoria_id: number
  categoria: string
  estado: string
  caracteristicas: {
    caracteristicas_principales: { [key: string]: string | number }
    otros: { [key: string]: string | number | null }
    moneda: string
  }
}

interface ProductTableProps {}

export function ProductTable({}: ProductTableProps) {
  // Estados del modal
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [filterOpen, setFilterOpen] = useState(false)
  
  // Estados para ConfirmModal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    action: 'delete' | 'duplicate' | null
    product: Product | null
    message: string
  }>({
    isOpen: false,
    action: null,
    product: null,
    message: ''
  })

  // Hook de notificaciones
  const { addNotification } = useNotificationContext()

  // Usar hooks para manejar toda la lógica
  const {
    products,
    loading,
    error,
    filters,
    setFilters,
    filteredProducts,
    deleteProduct,
    duplicateProduct,
    refreshProducts,
    clearError
  } = useProducts()

  // Hook para categorías (necesario para el formulario)
  const { categories } = useCategories()

  // Hook para paginación
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
    totalItems: filteredProducts.length,
    itemsPerPage: 8  
  })

  // Productos de la página actual
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  // Resetear paginación cuando cambien los filtros
  useEffect(() => {
    resetPage()
  }, [filteredProducts.length, resetPage])

  // Función para manejar edición
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setShowModal(true)
  }

  // Función para manejar duplicación con ConfirmModal
  const handleDuplicate = (product: Product) => {
    if (product.estado !== 'publicado') {
      addNotification('warning', 'No se puede duplicar', 'Solo se pueden duplicar productos con estado "Publicado"')
      return
    }

    setConfirmModal({
      isOpen: true,
      action: 'duplicate',
      product,
      message: `¿Estás seguro de que quieres duplicar el producto "${product.nombre}"?`
    })
  }

  // Función para manejar eliminación con ConfirmModal
  const handleDelete = (product: Product) => {
    setConfirmModal({
      isOpen: true,
      action: 'delete',
      product,
      message: `¿Estás seguro de que quieres eliminar el producto "${product.nombre}"? Esta acción no se puede deshacer.`
    })
  }

  // Función para ejecutar la acción confirmada
  const handleConfirmAction = async () => {
    if (!confirmModal.product || !confirmModal.action) return

    try {
      let success = false
      
      if (confirmModal.action === 'delete') {
        success = await deleteProduct(confirmModal.product.id)
        if (success) {
          addNotification('success', 'Producto eliminado', 'El producto se eliminó correctamente')
        } else {
          addNotification('error', 'Error', 'No se pudo eliminar el producto')
        }
      } else if (confirmModal.action === 'duplicate') {
        success = await duplicateProduct(confirmModal.product)
        if (success) {
          addNotification('success', 'Producto duplicado', 'El producto se duplicó correctamente como borrador')
        } else {
          addNotification('error', 'Error', 'No se pudo duplicar el producto')
        }
      }

      // Cerrar el modal de confirmación
      setConfirmModal({ isOpen: false, action: null, product: null, message: '' })
      
    } catch (error: any) {
      addNotification('error', 'Error inesperado', 'Ocurrió un error inesperado')
    }
  }

  // Manejo de envío del formulario
  const handleFormSubmit = async (success: boolean) => {
    if (success) {
      // Recargar los productos para reflejar cambios
      await refreshProducts()
      setShowModal(false)
      setEditingProduct(null)
      addNotification('success', 'Producto guardado', 'Los cambios se guardaron correctamente')
    } else {
      addNotification('error', 'Error', 'No se pudo guardar el producto')
    }
  }

  const handleStatusFilterChange = (status: string) => {
    console.log('Changing filter to:', status)
    console.log('Total products before filter:', products.length)
    
    // Actualizar el filtro
    setFilters({ ...filters, status })
    
    // Cerrar el dropdown de filtros
    setFilterOpen(false)
  }

  // Configuración de columnas para la tabla
  const columns: Column<Product>[] = [
    {
      key: 'imagen',
      label: 'Imagen',
      width: '80px',
      render: (_:any, product: Product) => (
        product.imagen_url && product.imagen_url.length > 0 ? (
          <img
            src={product.imagen_url[0]}
            alt={product.nombre}
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
          />
        ) : (
          <LucideImage size={40} style={{ color: '#9ca3af' }} />
        )
      )
    },
    {
      key: 'nombre',
      label: 'Nombre',
      width: '300px',
      render: (nombre: string) => (
        <div
          style={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%',
          }}
          title={nombre} 
        >
          {nombre}
        </div>
      ),
    },
    {
      key: 'categoria',
      label: 'Categoría',
      width: '12%',
      render: (categoria: string) => (
        <div
          style={{
            maxWidth: '150px',          
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.9rem',
            color: categoria ? '#374151' : '#9ca3af',
            fontStyle: categoria ? 'normal' : 'italic',
          }}
          title={categoria || 'Sin categoría'}
        >
          {categoria || 'Sin categoría'}
        </div>
      ),
    },
    {
      key: 'descripcion',
      label: 'Descripción',
      width: '180px',
      render: (descripcion: string | null) => (
        <div
          style={{
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '0.9rem',
            color: descripcion ? '#374151' : '#9ca3af',
            fontStyle: descripcion ? 'normal' : 'italic',
          }}
          title={descripcion || 'Sin descripción'} 
        >
          {descripcion || 'Sin descripción'}
        </div>
      ),
    },
    {
      key: 'precio',
      label: 'Precio',
      width: '120px',        
      alignHeader: 'center', 
      render: (precio: string | number) => {
        const precioNum = typeof precio === 'string' ? parseFloat(precio) : precio
        return (
          <div style={{
            textAlign: 'right',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            ${precioNum.toFixed(2)}
          </div>
        )
      }
    },
    {
      key: 'stock',
      label: 'Stock',
      width: '80px',
      render: (stock: number) => (
        <div style={{ textAlign: 'center' }}>
          {stock || 0}
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      width: '150px',         
      alignHeader: 'center',    
      render: (estado: string) => (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          width: '100%'
        }}>
          <StatusBadge status={estado} variant="product" />
        </div>
      )
    }
  ]

  // Mostrar error si hay y no hay productos
  if (error && products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', background: '#fee2e2', borderRadius: '8px', color: '#dc2626' }}>
        <p>{error}</p>
        <button 
          onClick={() => {
            clearError()
            refreshProducts()
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
      maxWidth: '1240px', 
      margin: '0 auto', 
      padding: '0 1rem',
      width: '100%'
    }}>
      <h1 style={{ color: '#444649ff', fontFamily: 'Protest Strike', fontSize: '28px' }}>Gestión de Productos</h1>
      <p style={{ color: '#6b7280', marginBottom: '1rem', fontFamily: 'Poppins' }}>Lista de productos</p>
      
      <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '12px', overflowX: 'auto'}}>
        
        {/* Contenedor de botones en la misma fila */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          
          {/* Botón de Filtros con dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
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
              Filtros ({filters.status})
            </button>

            {filterOpen && (
              <div
                style={{
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
                  minWidth: '120px'
                }}
              >
                {['Todos', 'Publicado', 'Borrador', 'Oculto'].map(status => (
                  <label key={status} style={{ display: 'block', marginBottom: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={filters.status === status}
                      onChange={() => handleStatusFilterChange(status)}
                      style={{ marginRight: '6px' }}
                    />
                    {status}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Botón de Agregar Producto */}
          <button
            onClick={() => setShowModal(true)}
            style={{ 
              background: '#3B001E', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              fontWeight: 'bold', 
              cursor: 'pointer' ,
              minHeight: '35px'
            }}
          >
            + Agregar Producto
          </button>
        </div>

        {/* Mostrar error si hay pero también hay productos */}
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

        {/* Tabla */}
        <DataTable
          data={currentProducts}
          columns={columns}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
          emptyMessage={`No hay productos con estado "${filters.status}"`}
        />

        {/* Modal de formulario */}
        {showModal && (
          <Suspense fallback={<ModalLoading />}>
            <ProductForm
              isOpen={showModal}
              onClose={() => {
                setShowModal(false)
                setEditingProduct(null)
              }}
              onSubmit={handleFormSubmit}
              editingProduct={editingProduct}
              categories={categories}
            />
          </Suspense>
        )}

        {/* Modal de confirmación */}
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
      
      {/* Paginación */}
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
    </div>
  )
}