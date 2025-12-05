//src/types/product.ts
export type ProductSpecs = {
  caracteristicas_principales?: { Marca?: string; Modelo?: string; Color?: string }
  otros?: Record<string, unknown>
  marca?: string
}

export type Product = {
  id: number
  nombre: string
  descripcion?: string | null
  precio: number | string
  stock: number
  imagen_url?: string[] | null           
  categoria_id: number
  admin_id?: number
  fecha_creacion?: string
  estado?: 'publicado' | 'activo' | 'inactivo' | 'borrador' | string
  recuento_resenas?: number
  recuento_ventas?: number
  especificaciones?: ProductSpecs | null
}