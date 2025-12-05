//src/api/products.ts
import { http } from './http'
import type { Product } from '../types/product'

export type Page<T> = {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  links?: any
}

export type ProductQuery = {
  q?: string
  categoria_id?: number
  min_price?: number
  max_price?: number
  sort?: 'nombre' | 'precio' | 'ventas' | 'resenas' | 'fecha'
  dir?: 'asc' | 'desc'
  page?: number
  per_page?: number
}

/** ---- helpers de normalización ---- */
type RawProduct = Omit<Product, 'imagen_url' | 'precio'> & {
  imagen_url?: string | string[] | null
  precio?: number | string
}

const normalizeImagenes = (v: unknown): string[] | null => {
  if (v == null) return null
  if (Array.isArray(v)) return v.filter(Boolean) as string[]
  if (typeof v === 'string') {
    const s = v.trim()
    if (!s) return []
    try {
      const j = JSON.parse(s)
      if (Array.isArray(j)) return j.filter(Boolean)
    } catch { /* no era JSON */ }
    return s.split(',').map(x => x.trim()).filter(Boolean)
  }
  return null
}

// Convierte "S/ 3,135.00", "1.499,99", "1499.00" → número
const toNumber = (n: number | string | undefined): number => {
  if (typeof n === 'number') return Number.isFinite(n) ? n : 0
  if (typeof n !== 'string') return 0

  const raw = n.trim()
  if (!raw) return 0

  // deja solo dígitos, coma y punto
  const cleaned = raw.replace(/[^\d.,-]/g, '')
  const lastDot = cleaned.lastIndexOf('.')
  const lastComma = cleaned.lastIndexOf(',')
  const lastSep = Math.max(lastDot, lastComma)

  if (lastSep === -1) {
    const intOnly = cleaned.replace(/[.,]/g, '')
    const num = Number(intOnly)
    return Number.isFinite(num) ? num : 0
  }

  const intPart = cleaned.slice(0, lastSep).replace(/[.,]/g, '')
  const decPart = cleaned.slice(lastSep + 1).replace(/[^\d]/g, '')
  const composed = `${intPart}.${decPart}`
  const num = Number(composed)
  return Number.isFinite(num) ? num : 0
}

const mapProduct = (p: RawProduct): Product => ({
  ...(p as Product),
  imagen_url: normalizeImagenes(p.imagen_url) ?? [],
  precio: toNumber(p.precio ?? 0),
})

/** Normalizar SIEMPRE a Page<Product> */
export async function getProducts(params: ProductQuery = {}): Promise<Page<Product>> {
  try {
    // Mapeo de nombres de query (mantén ambos si no estás seguro)
    const qp: any = { ...params }
    if (params.categoria_id != null) qp.categoria_id = params.categoria_id
    if (params.min_price != null) qp.precio_min = params.min_price   // <-- borra si tu API NO lo usa
    if (params.max_price != null) qp.precio_max = params.max_price   // <-- borra si tu API NO lo usa

    const { data: raw } = await http.get<any>('/productos', { params: qp })

    if (Array.isArray(raw)) {
      const normalized = (raw as RawProduct[]).map(mapProduct)
      const total = normalized.length
      return {
        data: normalized,
        meta: { current_page: 1, last_page: 1, per_page: total, total },
        links: undefined,
      }
    }

    if (raw && typeof raw === 'object' && 'current_page' in raw && 'data' in raw) {
      const list = Array.isArray(raw.data) ? (raw.data as RawProduct[]).map(mapProduct) : []
      return {
        data: list,
        meta: {
          current_page: Number(raw.current_page ?? 1),
          last_page: Number(raw.last_page ?? 1),
          per_page: Number(raw.per_page ?? params.per_page ?? list.length),
          total: Number(raw.total ?? list.length),
        },
        links: raw.links,
      }
    }

    if (raw && typeof raw === 'object' && 'meta' in raw) {
      const list = Array.isArray(raw.data) ? (raw.data as RawProduct[]).map(mapProduct) : []
      return {
        data: list,
        meta: raw.meta,
        links: raw.links,
      }
    }

    // Fallback seguro
    return {
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 0, total: 0 },
      links: undefined,
    }
  } catch (error) {
    // Fallback a datos mock cuando falla la conexión
    console.warn('API no disponible, usando datos mock con filtros aplicados:', error)
    const { mockProductsData } = await import('../data/mockProducts')
    
    // Aplicar filtros a los datos mock
    let filteredData = [...mockProductsData]
    
    // Filtrar por categoría
    if (params.categoria_id) {
      filteredData = filteredData.filter(product => product.categoria_id === params.categoria_id)
    }
    
    // Filtrar por búsqueda de texto
    if (params.q) {
      const searchTerm = params.q.toLowerCase()
      filteredData = filteredData.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm)) ||
        (product.especificaciones?.caracteristicas_principales?.Marca?.toLowerCase().includes(searchTerm)) ||
        (product.especificaciones?.marca?.toLowerCase().includes(searchTerm))
      )
    }
    
    // Filtrar por rango de precios
    if (params.min_price || params.max_price) {
      filteredData = filteredData.filter(product => {
        const price = typeof product.precio === 'number' ? product.precio : parseFloat(product.precio.toString())
        const minPrice = params.min_price || 0
        const maxPrice = params.max_price || 999999
        return price >= minPrice && price <= maxPrice
      })
    }
    
    // Aplicar ordenamiento
    if (params.sort) {
      filteredData.sort((a, b) => {
        let aValue, bValue
        
        switch (params.sort) {
          case 'nombre':
            aValue = a.nombre.toLowerCase()
            bValue = b.nombre.toLowerCase()
            break
          case 'precio':
            aValue = typeof a.precio === 'number' ? a.precio : parseFloat(a.precio.toString())
            bValue = typeof b.precio === 'number' ? b.precio : parseFloat(b.precio.toString())
            break
          case 'ventas':
            aValue = a.recuento_ventas || 0
            bValue = b.recuento_ventas || 0
            break
          case 'resenas':
            aValue = a.recuento_resenas || 0
            bValue = b.recuento_resenas || 0
            break
          case 'fecha':
            aValue = new Date(a.fecha_creacion || '').getTime()
            bValue = new Date(b.fecha_creacion || '').getTime()
            break
          default:
            return 0
        }
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return params.dir === 'desc' ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue)
        } else {
          return params.dir === 'desc' ? (bValue as number) - (aValue as number) : (aValue as number) - (bValue as number)
        }
      })
    }
    
    // Aplicar paginación
    const page = params.page || 1
    const perPage = params.per_page || filteredData.length
    const totalItems = filteredData.length
    const totalPages = Math.ceil(totalItems / perPage)
    const startIndex = (page - 1) * perPage
    const endIndex = startIndex + perPage
    const paginatedData = filteredData.slice(startIndex, endIndex)
    
    return {
      data: paginatedData,
      meta: { 
        current_page: page, 
        last_page: totalPages, 
        per_page: perPage, 
        total: totalItems 
      },
      links: undefined,
    }
  }
}

/** Más vendidos (ya normalizado) */
export async function fetchBestSellers(limit = 10): Promise<Product[]> {
  const res = await getProducts({ sort: 'ventas', dir: 'desc', per_page: limit })
  return res.data
}

export async function getProducto(id: number): Promise<Product> {
  try {
    const { data } = await http.get<RawProduct>(`/productos/${id}`)
    return mapProduct(data)
  } catch (error) {
    // Fallback a datos mock cuando falla la conexión
    console.warn('API no disponible, usando producto mock:', error)
    const { getMockProduct } = await import('../data/mockProducts')
    const mockProduct = getMockProduct(id)
    if (mockProduct) {
      return mockProduct
    }
    throw new Error(`Producto con ID ${id} no encontrado`)
  }
}

export type { Product } from '../types/product'
