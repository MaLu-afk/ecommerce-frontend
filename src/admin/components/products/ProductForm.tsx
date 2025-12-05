// admin/components/products/ProductForm.tsx
import React, { useState, useEffect } from 'react'
import { Image as LucideImage, X, Trash2 } from 'lucide-react'
import { FormModal } from '../shared/FormModal'
import { ConfirmModal } from '../shared/ConfirmModal'
import { ProductService } from '../../services/productService'
import { useNotificationContext } from '../../context/NotificationContext'
import type { Product, CreateProductData } from '../../types/product'
import type { Category } from '../../types/category'

interface ProductFormData {
  nombre: string
  descripcion: string
  precio: string
  stock: string
  imagen_url: string[]
  categoria_id: string
  estado: 'publicado' | 'oculto' | 'borrador'
  especificaciones: {
    caracteristicas_principales: { [key: string]: string }[]
    otros: { [key: string]: string }[]
  }
}

interface ProductFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (success: boolean) => void
  editingProduct: Product | null
  categories: Category[]
}

export default function ProductForm({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  categories
}: ProductFormProps) {
  // Estados del formulario
  const [formData, setFormData] = useState<ProductFormData>({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    imagen_url: [],
    categoria_id: '',
    estado: 'borrador',
    especificaciones: {
      caracteristicas_principales: [],
      otros: []
    }
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')
  const [newMainChar, setNewMainChar] = useState({ name: '', value: '' })
  const [newOtherChar, setNewOtherChar] = useState({ name: '', value: '' })
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Hook de notificaciones
  const { addNotification } = useNotificationContext()

  // Función para convertir objeto plano a array de objetos para el formulario
  const convertObjectToArray = (obj: { [key: string]: any } | undefined): { [key: string]: string }[] => {
    if (!obj || typeof obj !== 'object') return []
    return Object.entries(obj).map(([key, value]) => ({ [key]: String(value || '') }))
  }

  // Función para convertir array de objetos a objeto plano para el backend
  const convertArrayToObject = (arr: { [key: string]: string }[]): { [key: string]: string } => {
    const result: { [key: string]: string } = {}
    arr.forEach(item => {
      const key = Object.keys(item)[0]
      if (key) {
        result[key] = item[key]
      }
    })
    return result
  }

  // Cargar datos del producto al editar
  useEffect(() => {
    if (editingProduct && categories.length > 0) {
      console.log('Editing product:', editingProduct)
      console.log('Caracteristicas from backend:', editingProduct.caracteristicas)
      
      setFormData({
        nombre: editingProduct.nombre || '',
        descripcion: editingProduct.descripcion || '',
        precio: editingProduct.precio?.toString() || '',
        stock: editingProduct.stock?.toString() || '0',
        imagen_url: editingProduct.imagen_url || [],
        categoria_id: editingProduct.categoria_id?.toString() || '',
        estado:
          editingProduct.estado === 'publicado' ||
          editingProduct.estado === 'oculto' ||
          editingProduct.estado === 'borrador'
            ? editingProduct.estado
            : 'borrador',
        especificaciones: {
          caracteristicas_principales: convertObjectToArray(editingProduct.caracteristicas?.caracteristicas_principales),
          otros: convertObjectToArray(editingProduct.caracteristicas?.otros)
        }
      })
    } else if (!editingProduct) {
      // Resetear formulario para nuevo producto
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        imagen_url: [],
        categoria_id: '',
        estado: 'borrador',
        especificaciones: {
          caracteristicas_principales: [],
          otros: []
        }
      })
    }
  }, [editingProduct, categories])

  // Manejo del cambio de categoría
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value)
    const categoryData = categories.find(cat => cat.id === categoryId)
    
    setFormData(prev => ({
      ...prev,
      categoria_id: categoryId.toString(),
      descripcion: prev.descripcion || (categoryData?.caracteristicas || ''),
      especificaciones: categoryData ? {
        caracteristicas_principales: categoryData.plantilla_detalles?.caracteristicas_principales ? 
          Object.keys(categoryData.plantilla_detalles.caracteristicas_principales).map(key => ({ [key]: '' })) : [],
        otros: categoryData.plantilla_detalles?.otros ? 
          Object.keys(categoryData.plantilla_detalles.otros).map(key => ({ [key]: '' })) : []
      } : { caracteristicas_principales: [], otros: [] }
    }))
  }

  // Funciones para manejar imágenes
  const addImage = () => {
    if (newImageUrl.trim() && formData.imagen_url.length < 3) {
      setFormData(prev => ({
        ...prev,
        imagen_url: [...prev.imagen_url, newImageUrl.trim()]
      }))
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagen_url: prev.imagen_url.filter((_, i) => i !== index)
    }))
  }

  const handleImageKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addImage()
    }
  }

  // Funciones para manejar características
  const addMainCharacteristic = () => {
    if (newMainChar.name.trim()) {
      setFormData(prev => ({
        ...prev,
        especificaciones: {
          ...prev.especificaciones,
          caracteristicas_principales: [...prev.especificaciones.caracteristicas_principales, { [newMainChar.name.trim()]: newMainChar.value.trim() }]
        }
      }))
      setNewMainChar({ name: '', value: '' })
    }
  }

  const addOtherCharacteristic = () => {
    if (newOtherChar.name.trim()) {
      setFormData(prev => ({
        ...prev,
        especificaciones: {
          ...prev.especificaciones,
          otros: [...prev.especificaciones.otros, { [newOtherChar.name.trim()]: newOtherChar.value.trim() }]
        }
      }))
      setNewOtherChar({ name: '', value: '' })
    }
  }

  const handleCharacteristicChange = (section: 'caracteristicas_principales' | 'otros', index: number, field: 'name' | 'value', value: string) => {
    setFormData(prev => {
      const newSpecifications = { ...prev.especificaciones }
      if (field === 'name') {
        const oldKey = Object.keys(newSpecifications[section][index])[0]
        const oldValue = newSpecifications[section][index][oldKey]
        newSpecifications[section][index] = { [value]: oldValue }
      } else {
        const key = Object.keys(newSpecifications[section][index])[0]
        newSpecifications[section][index] = { [key]: value }
      }
      
      return {
        ...prev,
        especificaciones: newSpecifications
      }
    })
  }

  const removeMainCharacteristic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: {
        ...prev.especificaciones,
        caracteristicas_principales: prev.especificaciones.caracteristicas_principales.filter((_, i) => i !== index)
      }
    }))
  }

  const removeOtherCharacteristic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      especificaciones: {
        ...prev.especificaciones,
        otros: prev.especificaciones.otros.filter((_, i) => i !== index)
      }
    }))
  }

  // Función para manejar cambio de estado con tipo seguro
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    // Verificar que el valor sea uno de los permitidos
    if (value === 'publicado' || value === 'oculto' || value === 'borrador') {
      setFormData({ ...formData, estado: value })
    }
  }

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validaciones
    if (!formData.nombre.trim()) {
      addNotification('error', 'Error de validación', 'El nombre del producto es obligatorio')
      return
    }
    
    if (!formData.categoria_id) {
      addNotification('error', 'Error de validación', 'Debe seleccionar una categoría')
      return
    }

    if (!formData.precio || parseFloat(formData.precio) <= 0) {
      addNotification('error', 'Error de validación', 'El precio debe ser mayor a 0')
      return
    }

    // Mostrar modal de confirmación
    setShowConfirmModal(true)
  }

  // Función para manejar la confirmación del guardado
  const handleConfirmSave = async () => {
    setShowConfirmModal(false)
    setIsSubmitting(true)

    try {
      // Transformar datos del formulario para la API - convertir a formato backend
      const productData: CreateProductData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock) || 0,
        imagen_url: formData.imagen_url,
        categoria_id: parseInt(formData.categoria_id),
        admin_id: 1, // Por ahora hardcodeado
        estado: formData.estado,
        especificaciones: {
          caracteristicas_principales: convertArrayToObject(formData.especificaciones.caracteristicas_principales),
          otros: convertArrayToObject(formData.especificaciones.otros),
          moneda: 'USD'
        }
      }

      console.log('Sending product data:', productData)

      if (editingProduct) {
        await ProductService.update(editingProduct.id, productData)
      } else {
        await ProductService.create(productData)
      }

      onSubmit(true)
      
    } catch (error: any) {
      console.error('Error al guardar producto:', error)
      addNotification('error', 'Error al guardar', `Error al guardar producto: ${error.message}`)
      onSubmit(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={editingProduct ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        onSubmit={handleSubmit}
        submitText={editingProduct ? 'Guardar Cambios' : 'Agregar Producto'}
        isSubmitting={isSubmitting}
        size="large"
      >
        {/* Sección de imágenes */}
        <div style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
          <p style={{ color: '#6b7280', marginBottom: '10px' }}>
            Haz clic para subir imágenes PNG, JPG hasta 2000px o arrastra y suelta
          </p>
          <LucideImage size={40} style={{ color: '#9ca3af', margin: '0 auto' }} />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input
              type="text"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyPress={handleImageKeyPress}
              placeholder="URL de la imagen"
              style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
            />
            <button 
              type="button" 
              onClick={addImage}
              style={{ background: '#96332cff', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px' }}
            >
              Agregar
            </button>
          </div>
        </div>
        
        {/* Preview de imágenes */}
        {formData.imagen_url.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
            {formData.imagen_url.map((url, index) => (
              <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Campos básicos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Nombre del producto *"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
          <select
            value={formData.categoria_id}
            onChange={handleCategoryChange}
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          >
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Precio ($) *"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
          <input
            type="number"
            placeholder="Stock *"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
          
          {/* Select de estado con tipo seguro */}
          <select
            value={formData.estado}
            onChange={handleEstadoChange}
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          >
            <option value="publicado">Publicado</option>
            <option value="borrador">Borrador</option>
            <option value="oculto">Oculto</option>
          </select>
          
          <textarea
            placeholder="Descripción del producto"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            style={{ gridColumn: '1 / -1', height: '80px', padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px', resize: 'vertical' }}
          />
        </div>

        {/* Características principales */}
        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Características principales</span>
            <button
              type="button"
              onClick={addMainCharacteristic}
              style={{ background: '#96332cff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              + Agregar
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={newMainChar.name}
              onChange={(e) => setNewMainChar({...newMainChar, name: e.target.value})}
              placeholder="Nombre de la característica"
              style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
            />
            <input
              type="text"
              value={newMainChar.value}
              onChange={(e) => setNewMainChar({...newMainChar, value: e.target.value})}
              placeholder="Valor de la característica"
              style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
            />
          </div>
          
          {formData.especificaciones.caracteristicas_principales.map((characteristic, index) => {
            const key = Object.keys(characteristic)[0]
            const value = characteristic[key]
            
            return (
              <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={key || ''}
                  onChange={e => handleCharacteristicChange('caracteristicas_principales', index, 'name', e.target.value)}
                  placeholder="Atributo"
                  style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  value={value || ''}
                  onChange={e => handleCharacteristicChange('caracteristicas_principales', index, 'value', e.target.value)}
                  placeholder="Valor"
                  style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
                <button
                  type="button"
                  onClick={() => removeMainCharacteristic(index)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>

        {/* Otras características */}
        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Otros</span>
            <button
              type="button"
              onClick={addOtherCharacteristic}
              style={{ background: '#96332cff', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.875rem', cursor: 'pointer' }}
            >
              + Agregar
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              value={newOtherChar.name}
              onChange={(e) => setNewOtherChar({...newOtherChar, name: e.target.value})}
              placeholder="Nombre de la característica"
              style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
            />
            <input
              type="text"
              value={newOtherChar.value}
              onChange={(e) => setNewOtherChar({...newOtherChar, value: e.target.value})}
              placeholder="Valor de la característica"
              style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.875rem' }}
            />
          </div>
          
          {formData.especificaciones.otros.map((characteristic, index) => {
            const key = Object.keys(characteristic)[0]
            const value = characteristic[key]
            
            return (
              <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={key || ''}
                  onChange={e => handleCharacteristicChange('otros', index, 'name', e.target.value)}
                  placeholder="Atributo"
                  style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
                <input
                  type="text"
                  value={value || ''}
                  onChange={e => handleCharacteristicChange('otros', index, 'value', e.target.value)}
                  placeholder="Valor"
                  style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                />
                <button
                  type="button"
                  onClick={() => removeOtherCharacteristic(index)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )
          })}
        </div>
      </FormModal>

      {/* Modal de confirmación para guardar */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Confirmar guardado"
        message={editingProduct 
          ? "¿Estás seguro de que quieres guardar los cambios en este producto?" 
          : "¿Estás seguro de que quieres agregar este nuevo producto?"}
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        type="info"
      />
    </>
  )
}