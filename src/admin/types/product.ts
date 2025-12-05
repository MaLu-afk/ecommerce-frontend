// admin/types/product.ts
export interface Product {
  id: number
  nombre: string
  descripcion: string | null
  precio: string | number // El backend devuelve string
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

export interface CreateProductData {
  nombre: string
  descripcion?: string | null
  precio: number
  stock?: number
  imagen_url?: string[]
  categoria_id: number
  admin_id: number
  estado: 'publicado' | 'oculto' | 'borrador'
  especificaciones?: {
    caracteristicas_principales: { [key: string]: string | number }
    otros: { [key: string]: string | number | null }
    moneda?: string
  }
}

export interface ProductFilters {
  status: string
  search?: string
  category?: number
}