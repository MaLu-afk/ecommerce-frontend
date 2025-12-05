// admin/hooks/useProducts.ts
import { useState, useEffect, useCallback, useMemo } from 'react'
import { ProductService } from '../services/productService'
import type { Product, CreateProductData, ProductFilters } from '../types/product'

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  filters: ProductFilters
  setFilters: (filters: ProductFilters) => void
  filteredProducts: Product[]
  fetchProducts: () => Promise<void>
  createProduct: (data: CreateProductData) => Promise<boolean>
  updateProduct: (id: number, data: CreateProductData) => Promise<boolean>
  deleteProduct: (id: number) => Promise<boolean>
  duplicateProduct: (product: Product) => Promise<boolean>
  refreshProducts: () => Promise<void>
  clearError: () => void
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({
    status: 'Todos'
  })

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('useProducts: Fetching products...')
      
      const data = await ProductService.getAll()
      console.log('useProducts: Products received:', data)
      setProducts(data)
    } catch (error: any) {
      console.error('useProducts: Error cargando productos:', error)
      setError(error.message)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createProduct = useCallback(async (productData: CreateProductData): Promise<boolean> => {
    try {
      setError(null)
      await ProductService.create(productData)
      await fetchProducts()
      return true
    } catch (error: any) {
      console.error('Error al crear producto:', error)
      setError(error.message)
      return false
    }
  }, [fetchProducts])

  const updateProduct = useCallback(async (id: number, productData: CreateProductData): Promise<boolean> => {
    try {
      setError(null)
      await ProductService.update(id, productData)
      await fetchProducts()
      return true
    } catch (error: any) {
      console.error('Error al actualizar producto:', error)
      setError(error.message)
      return false
    }
  }, [fetchProducts])

  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null)
      await ProductService.delete(id)
      setProducts(prev => prev.filter(product => product.id !== id))
      return true
    } catch (error: any) {
      console.error('Error al eliminar producto:', error)
      setError(error.message)
      return false
    }
  }, [])

  const duplicateProduct = useCallback(async (product: Product): Promise<boolean> => {
    if (product.estado !== 'publicado') {
      setError('Solo se pueden duplicar productos con estado "Publicado"')
      return false
    }

    try {
      setError(null)
      await ProductService.duplicate(product)
      await fetchProducts()
      return true
    } catch (error: any) {
      console.error('Error al duplicar producto:', error)
      setError(error.message)
      return false
    }
  }, [fetchProducts])

  const filteredProducts = useMemo(() => {
    console.log('useProducts: Filtering products with filters:', filters)
    console.log('useProducts: Total products:', products.length)
    
    let filtered = products

    if (filters.status !== 'Todos') {
      filtered = filtered.filter(product => 
        product.estado === filters.status.toLowerCase()
      )
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(product => {
        const nombre = (product.nombre || '').toLowerCase()
        const descripcion = (product.descripcion || '').toLowerCase()
        return nombre.includes(searchTerm) || descripcion.includes(searchTerm)
      })
    }

    if (filters.category) {
      filtered = filtered.filter(product => 
        product.categoria_id === filters.category
      )
    }

    console.log('useProducts: Filtered products:', filtered.length)
    return filtered
  }, [products, filters])

  const refreshProducts = useCallback(async () => {
    await fetchProducts()
  }, [fetchProducts])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  useEffect(() => {
    console.log('useProducts: Component mounted, fetching products...')
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    filteredProducts,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    refreshProducts,
    clearError
  }
}