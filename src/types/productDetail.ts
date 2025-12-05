// src/types/productDetail.ts

/**
 * Distribución de calificaciones por estrellas
 */
export interface RatingDistribution {
  "5": number
  "4": number
  "3": number
  "2": number
  "1": number
}

/**
 * Rating válido: solo valores de 1 a 5
 */
export type Rating = 1 | 2 | 3 | 4 | 5

/**
 * Reseña individual de un producto
 */
export interface Review {
  id: number
  usuario_nombre: string
  rating: Rating
  comentario: string
  fecha: string 
}

/**
 * Especificaciones técnicas del producto
 */
export interface ProductSpecifications {
  caracteristicas_principales: Record<string, string | null>
  otros: Record<string, string | number | null>
  moneda?: string
}

/**
 * Categoría del producto
 */
export interface ProductCategory {
  id: number
  nombre: string
  caracteristicas: string
  fecha_creacion: string
  plantilla_detalles: {
    caracteristicas_principales: Record<string, null>
    otros: Record<string, null>
  }
}

/**
 * Estado del producto
 */
export type ProductStatus = 'publicado' | 'borrador' | 'archivado' | string

/**
 * Datos completos de un producto (normalizado)
 */
export interface ProductData {
  id: number
  nombre: string
  categoria_id: number
  descripcion: string | null
  precio: number
  stock: number
  imagen_url: string[]
  estado: ProductStatus
  especificaciones: ProductSpecifications
  admin_id?: number
  fecha_creacion?: string
  recuento_ventas?: number
  recuento_resenas: number
  rating_promedio?: number
  rating_distribucion?: RatingDistribution
  resenas?: Review[]
  categoria?: ProductCategory
}

/**
 * Datos mínimos para listados
 */
export interface ProductSummary {
  id: number
  nombre: string
  precio: number
  imagen_url: string
  rating_promedio?: number
  recuento_resenas: number
}

/**
 * Payload para crear reseña
 */
export interface CreateReviewPayload {
  producto_id: number
  user_id: number
  clasificacion: Rating
  comentario: string
}

/**
 * Respuesta al crear reseña
 */
export interface CreateReviewResponse {
  success: boolean
  review: Review
  message?: string
}