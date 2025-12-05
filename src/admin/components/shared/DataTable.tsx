// admin/components/shared/DataTable.tsx
import React from 'react'
import { Edit, Trash2, Copy } from 'lucide-react'

export interface Column<T> {
  key: keyof T | string
  label: string
  width?: string
  render?: (value: any, item: T) => React.ReactNode
  alignHeader?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  onDuplicate?: (item: T) => void
  customActions?: (item: T) => React.ReactNode
  emptyMessage?: string
  className?: string
}

export function DataTable<T extends { id: number | string }>({
  data,
  columns,
  loading = false,
  onEdit,
  onDelete,
  onDuplicate,
  customActions,
  emptyMessage = "No hay datos disponibles",
  className = ""
}: DataTableProps<T>) {
  
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Cargando datos...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>{emptyMessage}</p>
      </div>
    )
  }

  const getCellValue = (item: T, column: Column<T>) => {
    if (column.render) {
      const value = typeof column.key === 'string' && column.key.includes('.') 
        ? getNestedValue(item, column.key)
        : (item as any)[column.key]
      return column.render(value, item)
    }
    
    if (typeof column.key === 'string' && column.key.includes('.')) {
      return getNestedValue(item, column.key)
    }
    
    return (item as any)[column.key]
  }

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((curr, prop) => curr?.[prop], obj)
  }

  // Si hay customActions, usar esas; si no, usar las acciones predeterminadas
  const hasActions = customActions || onEdit || onDelete || onDuplicate
  
  return (
    <div className={`data-table-container ${className}`}>
      <table className="data-table" style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index}
                style={{ width: column.width, textAlign: column.alignHeader || 'left',}}
              >
                {column.label}
              </th>
            ))}
            {hasActions && <th className="actions-header">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={item.id || rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {getCellValue(item, column)}
                </td>
              ))}
              {hasActions && (
                <td className="actions-cell">
                  {customActions ? (
                    // Renderizar acciones personalizadas
                    customActions(item)
                  ) : (
                    // Renderizar acciones predeterminadas
                    <div className="action-buttons-horizontal">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="action-btn edit-btn action-btn-medium"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                      )}
                      {onDuplicate && (
                        <button
                          onClick={() => {
                            const estado = (item as any).estado?.toLowerCase()
                            if (estado === 'borrador' || estado === 'draft') {
                              return
                            }
                            onDuplicate(item)
                          }}
                          className={`action-btn duplicate-btn action-btn-medium ${
                            (item as any).estado?.toLowerCase() === 'borrador' || (item as any).estado?.toLowerCase() === 'draft' 
                              ? 'disabled' 
                              : ''
                          }`}
                          disabled={(item as any).estado?.toLowerCase() === 'borrador' || (item as any).estado?.toLowerCase() === 'draft'}
                          title={(item as any).estado?.toLowerCase() === 'borrador' || (item as any).estado?.toLowerCase() === 'draft' 
                            ? "No se puede duplicar un producto en borrador" 
                            : "Duplicar"}
                        >
                          <Copy size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="action-btn delete-btn action-btn-medium"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}