// admin/services/productService.ts
import type { Product, CreateProductData } from '../types/product'

const API_BASE_URL = 'http://localhost:8000/api/admin'

export class ProductService {
  
  static async getAll(): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error obteniendo productos:', error)
      throw error
    }
  }

  static async getByStatus(estado: string): Promise<Product[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/estado/${estado}`)
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error obteniendo productos con estado ${estado}:`, error)
      throw error
    }
  }

  static async create(productData: CreateProductData): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error('Error creando producto:', error)
      throw error
    }
  }

  static async update(id: number, productData: CreateProductData): Promise<Product> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.message || `Error ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (error) {
      console.error(`Error actualizando producto ${id}:`, error)
      throw error
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error(`Error eliminando producto ${id}:`, error)
      throw error
    }
  }

  static async duplicate(product: Product): Promise<Product> {
    if (product.estado !== 'publicado') {
      throw new Error('Solo se pueden duplicar productos con estado "Publicado"')
    }

    const duplicatedData: CreateProductData = {
      nombre: `${product.nombre} (Copia)`,
      descripcion: product.descripcion,
      precio: typeof product.precio === 'string' ? parseFloat(product.precio) : product.precio,
      stock: product.stock,
      imagen_url: product.imagen_url && product.imagen_url.length > 0 ? [...product.imagen_url] : [],
      categoria_id: product.categoria_id,
      admin_id: product.admin_id,
      estado: 'borrador',
      especificaciones: {
        caracteristicas_principales: product.caracteristicas?.caracteristicas_principales || {},
        otros: product.caracteristicas?.otros || {},
        moneda: product.caracteristicas?.moneda || 'USD'
      }
    }

    return this.create(duplicatedData)
  }
}