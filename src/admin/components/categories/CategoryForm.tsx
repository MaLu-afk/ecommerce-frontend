// admin/components/categories/CategoryForm.tsx
import React, { useState, useEffect } from 'react'
import { FormModal } from '../shared/FormModal'
import { ConfirmModal } from '../shared/ConfirmModal'
import { CategoryService } from '../../services/categoryService'
import { useNotificationContext } from '../../context/NotificationContext'
import type { Category, CategoryFormData } from '../../types/category'

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (success: boolean) => void
  editingCategory: Category | null
}

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  editingCategory
}: CategoryFormProps) {
  // Estados del formulario
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    mainCharacteristics: [],
    otherCharacteristics: []
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newMainChar, setNewMainChar] = useState('')
  const [newOtherChar, setNewOtherChar] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Hook de notificaciones
  const { addNotification } = useNotificationContext()

  // Cargar datos de la categoría al editar
  useEffect(() => {
    if (editingCategory) {
      const { mainCharacteristics, otherCharacteristics } = CategoryService.extractCharacteristics(editingCategory)

      setFormData({
        name: editingCategory.nombre || '',
        description: editingCategory.caracteristicas || '',
        mainCharacteristics,
        otherCharacteristics
      })
    } else {
      // Resetear formulario para nueva categoría
      setFormData({
        name: '',
        description: '',
        mainCharacteristics: [],
        otherCharacteristics: []
      })
    }
  }, [editingCategory])

  // Funciones para manejar características
  const addMainCharacteristic = () => {
    if (newMainChar.trim()) {
      setFormData(prev => ({
        ...prev,
        mainCharacteristics: [...prev.mainCharacteristics, newMainChar.trim()]
      }))
      setNewMainChar('')
    }
  }

  const removeMainCharacteristic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      mainCharacteristics: prev.mainCharacteristics.filter((_, i) => i !== index)
    }))
  }

  const handleMainKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addMainCharacteristic()
    }
  }

  const addOtherCharacteristic = () => {
    if (newOtherChar.trim()) {
      setFormData(prev => ({
        ...prev,
        otherCharacteristics: [...prev.otherCharacteristics, newOtherChar.trim()]
      }))
      setNewOtherChar('')
    }
  }

  const removeOtherCharacteristic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      otherCharacteristics: prev.otherCharacteristics.filter((_, i) => i !== index)
    }))
  }

  const handleOtherKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addOtherCharacteristic()
    }
  }

  // Envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación
    if (!formData.name.trim()) {
      addNotification('error', 'Error de validación', 'El nombre de la categoría es obligatorio')
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
      const categoryData = CategoryService.buildCategoryData(formData)

      if (editingCategory) {
        await CategoryService.update(editingCategory.id, categoryData)
      } else {
        await CategoryService.create(categoryData)
      }

      onSubmit(true)
      
    } catch (error: any) {
      console.error('Error al guardar categoría:', error)
      addNotification('error', 'Error al guardar', `Error al guardar categoría: ${error.message}`)
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
        title={editingCategory ? 'Editar Categoría' : 'Agregar Categoría'}
        onSubmit={handleSubmit}
        submitText={editingCategory ? 'Actualizar Categoría' : 'Agregar Categoría'}
        isSubmitting={isSubmitting}
        size="medium"
      >
        {/* Campos básicos */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Nombre de la categoría *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '6px' }}
          />
          <textarea
            placeholder="Descripción de la categoría"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ 
              height: '80px', 
              padding: '10px', 
              border: '1px solid #d1d5db', 
              borderRadius: '6px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Características principales */}
        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Características principales</span>
            <button
              type="button"
              onClick={addMainCharacteristic}
              style={{ 
                background: '#96332cff', 
                color: 'white', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '0.875rem', 
                cursor: 'pointer' 
              }}
            >
              + Agregar
            </button>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              value={newMainChar}
              onChange={(e) => setNewMainChar(e.target.value)}
              onKeyPress={handleMainKeyPress}
              placeholder="Agregar característica principal"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '0.875rem' 
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {formData.mainCharacteristics.map((char, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '8px 12px', 
                  background: 'white', 
                  borderRadius: '6px', 
                  border: '1px solid #e5e7eb' 
                }}
              >
                <span style={{ color: '#374151', fontSize: '0.875rem' }}>• {char}</span>
                <button 
                  type="button" 
                  onClick={() => removeMainCharacteristic(index)}
                  style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '50%', 
                    width: '20px', 
                    height: '20px', 
                    cursor: 'pointer', 
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Otras características */}
        <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontWeight: '600', color: '#374151' }}>Otros</span>
            <button
              type="button"
              onClick={addOtherCharacteristic}
              style={{ 
                background: '#96332cff', 
                color: 'white', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                fontSize: '0.875rem', 
                cursor: 'pointer' 
              }}
            >
              + Agregar
            </button>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              value={newOtherChar}
              onChange={(e) => setNewOtherChar(e.target.value)}
              onKeyPress={handleOtherKeyPress}
              placeholder="Agregar otra característica"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #d1d5db', 
                borderRadius: '6px', 
                fontSize: '0.875rem' 
              }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {formData.otherCharacteristics.map((char, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '8px 12px', 
                  background: 'white', 
                  borderRadius: '6px', 
                  border: '1px solid #e5e7eb' 
                }}
              >
                <span style={{ color: '#374151', fontSize: '0.875rem' }}>• {char}</span>
                <button 
                  type="button" 
                  onClick={() => removeOtherCharacteristic(index)}
                  style={{ 
                    background: '#ef4444', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '50%', 
                    width: '20px', 
                    height: '20px', 
                    cursor: 'pointer', 
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </FormModal>

      {/* Modal de confirmación para guardar */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        title="Confirmar guardado"
        message={editingCategory 
          ? "¿Estás seguro de que quieres guardar los cambios en esta categoría?" 
          : "¿Estás seguro de que quieres agregar esta nueva categoría?"}
        confirmText="Sí, guardar"
        cancelText="Cancelar"
        type="info"
      />
    </>
  )
}