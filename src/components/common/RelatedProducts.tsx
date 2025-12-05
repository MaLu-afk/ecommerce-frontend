import { useState, useEffect } from 'react'
import { getProducts } from '../../api/products'
import type { Product } from '../../types/product'
import ProductCard from '../landing/ProductCard'

interface RelatedProductsProps {
  currentProductId: number
  categoryId?: number
}

/**
 * Componente de productos relacionados
 * 
 * Muestra una selección de productos similares al actual,
 * priorizando productos de la misma categoría y excluyendo
 * el producto actual para evitar duplicados.
 * 
 * Funcionalidades:
 * - Filtrado por categoría cuando está disponible
 * - Exclusión del producto actual
 * - Limitación a 4 productos para mantener el layout limpio
 * - Estados de loading y error manejados elegantemente
 * 
 * Conceptos importantes:
 * - **Cross-selling**: Técnica de ventas para mostrar productos relacionados
 * - **Category-based filtering**: Filtrado inteligente por categoría
 * - **Performance optimization**: Límite de productos para evitar sobrecarga
 */
export default function RelatedProducts({ currentProductId, categoryId }: RelatedProductsProps) {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtener productos, priorizando la misma categoría si está disponible
        const response = await getProducts({
          categoria_id: categoryId,
          per_page: 8, // Pedimos más para tener opciones después de filtrar
          sort: 'ventas',
          dir: 'desc'
        })

        // Filtrar el producto actual y limitar a 4 productos
        const filtered = response.data
          .filter(product => product.id !== currentProductId)
          .slice(0, 4)

        setRelatedProducts(filtered)
      } catch (err) {
        console.warn('Error al cargar productos relacionados:', err)
        setError('Error al cargar productos relacionados')
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, categoryId])

  // No mostrar la sección si no hay productos o hay error
  if (error || (!loading && relatedProducts.length === 0)) {
    return null
  }

  return (
    <section className="mt-12">
      <div className="border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Quizás te gusten estos productos
        </h2>

        {loading ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="animate-pulse">
                <div className="aspect-[4/3] bg-slate-200 rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Productos relacionados */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={`related-${product.id}`} p={product} />
            ))}
          </div>
        )}

        {!loading && relatedProducts.length < 4 && relatedProducts.length > 0 && (
          <p className="text-sm text-slate-500 text-center mt-4">
            Mostrando {relatedProducts.length} productos relacionados
          </p>
        )}
      </div>
    </section>
  )
}