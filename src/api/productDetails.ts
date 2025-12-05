import { http } from './http'
import type { 
  ProductData, 
  ProductCategory,
  RatingDistribution, 
  Review 
} from '../types/productDetail'

/**
 * Respuesta del endpoint /productos/:id
 */
interface ApiProductResponse {
  id: number
  nombre: string
  descripcion: string | null
  precio: string
  stock: number
  imagen_url: string[]
  categoria_id: number
  admin_id: number
  fecha_creacion: string
  recuento_resenas: number
  recuento_ventas: number
  especificaciones: {
    caracteristicas_principales: Record<string, string | null>
    otros: Record<string, string | number | null>
    moneda?: string
  }
  estado: string
  resenas_count: number
  categoria: ProductCategory
}

/**
 * Respuesta del endpoint /productos/:id/resenas
 */
interface ApiReviewsResponse {
  rating_promedio: number
  rating_distribucion: RatingDistribution
  recuento_resenas: number
  resenas: Review[]
}

/**
 * Convierte precio string a número
 */
function normalizePrice(precio: string): number {
  const num = parseFloat(precio)
  return Number.isFinite(num) ? num : 0
}

/**
 * Transforma respuestas de API a ProductData
 */
function toProductData(
  producto: ApiProductResponse, 
  reviews: ApiReviewsResponse
): ProductData {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: normalizePrice(producto.precio),
    stock: producto.stock,
    imagen_url: producto.imagen_url,
    categoria_id: producto.categoria_id,
    admin_id: producto.admin_id,
    fecha_creacion: producto.fecha_creacion,
    recuento_ventas: producto.recuento_ventas,
    especificaciones: producto.especificaciones,
    estado: producto.estado,
    categoria: producto.categoria,
    recuento_resenas: reviews.recuento_resenas,
    rating_promedio: reviews.rating_promedio,
    rating_distribucion: reviews.rating_distribucion,
    resenas: reviews.resenas
  }
}

/**
 * Obtiene detalles completos de un producto
 */
export async function getProductDetails(id: number): Promise<ProductData> {
  try {
    const [productRes, reviewsRes] = await Promise.all([
      http.get<ApiProductResponse>(`/productos/${id}`),
      http.get<ApiReviewsResponse>(`/productos/${id}/resenas`)
    ])
    
    return toProductData(productRes.data, reviewsRes.data)
    
  } catch (error) {
    console.error('[Error] Fetching product details:', error)
    throw error
  }
}

export type { ProductData, RatingDistribution, Review } from '../types/productDetail'