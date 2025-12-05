// admin/services/categoryService.ts
import  type { Category, CreateCategoryData } from '../types/category'

const API_BASE_URL = 'http://localhost:8000/api/admin'

// Clase para manejar todas las operaciones de categorías con la API
export class CategoryService {
  
  // Obtener todas las categorías
  static async getAll(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error obteniendo categorías:', error)
      throw error
    }
  }

  // Obtener categoría por ID
  static async getById(id: number): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error obteniendo categoría ${id}:`, error)
      throw error
    }
  }

  // Crear nueva categoría
  static async create(categoryData: CreateCategoryData): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error creando categoría:', error)
      throw error
    }
  }

  // Actualizar categoría existente
  static async update(id: number, categoryData: CreateCategoryData): Promise<Category> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Error actualizando categoría ${id}:`, error)
      throw error
    }
  }

  // Eliminar categoría
  static async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/categorias/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`Error eliminando categoría ${id}:`, error)
      throw error
    }
  }

  // Helper para construir datos de categoría desde el formulario
  static buildCategoryData(formData: {
    name: string
    description: string
    mainCharacteristics: string[]
    otherCharacteristics: string[]
  }): CreateCategoryData {
    const data: CreateCategoryData = {
      nombre: formData.name.trim(),
      caracteristicas: formData.description.trim() || null,
      plantilla_detalles: null
    }

    // Solo crear plantilla_detalles si hay características
    if (formData.mainCharacteristics.length > 0 || formData.otherCharacteristics.length > 0) {
      data.plantilla_detalles = {}
      
      if (formData.mainCharacteristics.length > 0) {
        data.plantilla_detalles.caracteristicas_principales = {}
        formData.mainCharacteristics.forEach(char => {
          data.plantilla_detalles!.caracteristicas_principales![char] = ""
        })
      }

      if (formData.otherCharacteristics.length > 0) {
        data.plantilla_detalles.otros = {}
        formData.otherCharacteristics.forEach(char => {
          data.plantilla_detalles!.otros![char] = ""
        })
      }
    }

    return data
  }

  // Helper para extraer características de una categoría
  static extractCharacteristics(category: Category): {
    mainCharacteristics: string[]
    otherCharacteristics: string[]
  } {
    let mainChars: string[] = []
    let otherChars: string[] = []
    
    if (category.plantilla_detalles) {
      if (category.plantilla_detalles.caracteristicas_principales) {
        mainChars = Object.keys(category.plantilla_detalles.caracteristicas_principales)
      }
      if (category.plantilla_detalles.otros) {
        otherChars = Object.keys(category.plantilla_detalles.otros)
      }
    }

    return { mainCharacteristics: mainChars, otherCharacteristics: otherChars }
  }

  // Helper para obtener estadísticas de plantilla
  static getTemplateStats(category: Category): {
    mainCount: number
    otherCount: number
    total: number
  } {
    const plantilla = category.plantilla_detalles
    if (!plantilla) {
      return { mainCount: 0, otherCount: 0, total: 0 }
    }

    const mainCount = plantilla.caracteristicas_principales ? 
      Object.keys(plantilla.caracteristicas_principales).length : 0
    const otherCount = plantilla.otros ? 
      Object.keys(plantilla.otros).length : 0
    const total = mainCount + otherCount

    return { mainCount, otherCount, total }
  }
}