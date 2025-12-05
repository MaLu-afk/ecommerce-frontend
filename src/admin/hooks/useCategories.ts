// admin/hooks/useCategories.ts
import { useState, useEffect, useCallback } from 'react'
import { CategoryService } from '../services/categoryService'
import type { Category, CreateCategoryData, CategoryFilters } from '../types/category'

interface UseCategoriesReturn {
  categories: Category[]
  loading: boolean
  error: string | null
  filters: CategoryFilters
  setFilters: (filters: CategoryFilters) => void
  filteredCategories: Category[]
  fetchCategories: () => Promise<void>
  createCategory: (data: CreateCategoryData) => Promise<boolean>
  updateCategory: (id: number, data: CreateCategoryData) => Promise<boolean>
  deleteCategory: (id: number) => Promise<boolean>
  refreshCategories: () => Promise<void>
  clearError: () => void
  getCategoryById: (id: number) => Category | undefined
  getTemplateStats: (category: Category) => { mainCount: number, otherCount: number, total: number }
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<CategoryFilters>({})

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await CategoryService.getAll()
      setCategories(data)
    } catch (error: any) {
      console.error('Error cargando categorías:', error)
      setError(error.message)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [])

  const createCategory = useCallback(async (categoryData: CreateCategoryData): Promise<boolean> => {
    try {
      setError(null)
      await CategoryService.create(categoryData)
      await fetchCategories()
      return true
    } catch (error: any) {
      console.error('Error al crear categoría:', error)
      setError(error.message)
      return false
    }
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: number, categoryData: CreateCategoryData): Promise<boolean> => {
    try {
      setError(null)
      await CategoryService.update(id, categoryData)
      await fetchCategories()
      return true
    } catch (error: any) {
      console.error('Error al actualizar categoría:', error)
      setError(error.message)
      return false
    }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    try {
      setError(null)
      await CategoryService.delete(id)
      setCategories(prev => prev.filter(category => category.id !== id))
      return true
    } catch (error: any) {
      console.error('Error al eliminar categoría:', error)
      setError(error.message)
      return false
    }
  }, [])

  const filteredCategories = categories.filter(category => {
    let shouldInclude = true

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      const nombre = category.nombre.toLowerCase()
      const caracteristicas = (category.caracteristicas || '').toLowerCase()
      shouldInclude = shouldInclude && (nombre.includes(searchTerm) || caracteristicas.includes(searchTerm))
    }

    if (filters.hasTemplate !== undefined) {
      const stats = CategoryService.getTemplateStats(category)
      shouldInclude = shouldInclude && ((stats.total > 0) === filters.hasTemplate)
    }

    return shouldInclude
  })

  const refreshCategories = useCallback(async () => {
    await fetchCategories()
  }, [fetchCategories])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const getCategoryById = useCallback((id: number): Category | undefined => {
    return categories.find(category => category.id === id)
  }, [categories])

  const getTemplateStats = useCallback((category: Category) => {
    return CategoryService.getTemplateStats(category)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    filters,
    setFilters,
    filteredCategories,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    clearError,
    getCategoryById,
    getTemplateStats
  }
}