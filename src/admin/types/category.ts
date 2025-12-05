// admin/types/category.ts

// Plantilla de detalles de una categoría
export interface CategoryTemplate {
  caracteristicas_principales?: { [key: string]: string }
  otros?: { [key: string]: string }
}

// Categoría tal como viene de la API
export interface Category {
  id: number
  nombre: string
  caracteristicas: string
  plantilla_detalles: CategoryTemplate | null
}

// Datos para crear o actualizar una categoría
export interface CreateCategoryData {
  nombre: string
  caracteristicas: string | null
  plantilla_detalles: CategoryTemplate | null
}

// Datos del formulario de categoría (antes de procesar)
export interface CategoryFormData {
  name: string
  description: string
  mainCharacteristics: string[]
  otherCharacteristics: string[]
}

// Filtros para categorías
export interface CategoryFilters {
  search?: string
  hasTemplate?: boolean
  hasProducts?: boolean
}

// Estadísticas de plantilla de una categoría
export interface CategoryTemplateStats {
  mainCount: number
  otherCount: number
  total: number
  hasTemplate: boolean
}

// Respuesta de la API al obtener categorías
export interface CategoriesResponse {
  data: Category[]
  total: number
  per_page: number
  current_page: number
  last_page: number
}

// Estados posibles de las operaciones
export type CategoryOperationStatus = 'idle' | 'loading' | 'success' | 'error'

// Para manejo de errores específicos
export interface CategoryError {
  message: string
  field?: string
  code?: string
}

// Estadísticas de categorías (para dashboard futuro)
export interface CategoryStats {
  total: number
  conPlantilla: number
  sinPlantilla: number
  conProductos: number
  sinProductos: number
  caracteristicasPromedio: number
}

// Para ordenamiento de categorías
export type CategorySortField = 'nombre' | 'caracteristicas' | 'productos_count' | 'template_count'
export type SortDirection = 'asc' | 'desc'

export interface CategorySort {
  field: CategorySortField
  direction: SortDirection
}

// Opciones para exportar categorías
export interface CategoryExportOptions {
  format: 'csv' | 'xlsx' | 'json'
  includeTemplate: boolean
  includeProductCount: boolean
  filters?: CategoryFilters
}

// Para validación de formularios
export interface CategoryValidationRules {
  nombre: {
    required: boolean
    minLength: number
    maxLength: number
    unique: boolean
  }
  caracteristicas: {
    required: boolean
    maxLength: number
  }
  mainCharacteristics: {
    maxItems: number
    duplicates: boolean
  }
  otherCharacteristics: {
    maxItems: number
    duplicates: boolean
  }
}

// Resultado de validación
export interface CategoryValidationResult {
  isValid: boolean
  errors: CategoryError[]
  warnings: string[]
}

// Para select de categorías en otros formularios
export interface CategoryOption {
  value: number
  label: string
  description?: string
  templateStats?: CategoryTemplateStats
}

// Configuración de una característica individual
export interface CharacteristicConfig {
  name: string
  type: 'text' | 'number' | 'select' | 'boolean'
  required: boolean
  options?: string[] // Para tipo select
  defaultValue?: string
  validation?: {
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: string
  }
}

// Plantilla avanzada (para futuras funcionalidades)
export interface AdvancedCategoryTemplate {
  caracteristicas_principales?: { [key: string]: CharacteristicConfig }
  otros?: { [key: string]: CharacteristicConfig }
  version: string
  created_at: string
  updated_at: string
}