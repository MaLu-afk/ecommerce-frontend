// admin/hooks/useAdminForm.ts
import { useState, useCallback, useEffect } from 'react'

interface UseAdminFormOptions<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<boolean>
  validate?: (values: T) => string[]
}

interface UseAdminFormReturn<T> {
  values: T
  isSubmitting: boolean
  errors: string[]
  setValue: (key: keyof T, value: any) => void
  setValues: (newValues: Partial<T>) => void
  resetForm: () => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  clearErrors: () => void
  addError: (error: string) => void
}

export function useAdminForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validate
}: UseAdminFormOptions<T>): UseAdminFormReturn<T> {
  const [values, setFormValues] = useState<T>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const setValue = useCallback((key: keyof T, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }))
    if (errors.length > 0) {
      setErrors([])
    }
  }, [errors.length])

  const setValues = useCallback((newValues: Partial<T>) => {
    setFormValues(prev => ({
      ...prev,
      ...newValues
    }))
    if (errors.length > 0) {
      setErrors([])
    }
  }, [errors.length])

  const resetForm = useCallback(() => {
    setFormValues(initialValues)
    setErrors([])
    setIsSubmitting(false)
  }, [initialValues])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const addError = useCallback((error: string) => {
    setErrors(prev => [...prev, error])
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors([])
    
    if (validate) {
      const validationErrors = validate(values)
      if (validationErrors.length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    setIsSubmitting(true)

    try {
      const success = await onSubmit(values)
      if (success) {
        resetForm()
      }
    } catch (error: any) {
      console.error('Error en formulario:', error)
      setErrors([`Error inesperado: ${error.message}`])
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate, onSubmit, resetForm])

  return {
    values,
    isSubmitting,
    errors,
    setValue,
    setValues,
    resetForm,
    handleSubmit,
    clearErrors,
    addError
  }
}

interface UsePaginationOptions {
  totalItems: number
  itemsPerPage?: number
  initialPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  startIndex: number
  endIndex: number
  goToPage: (page: number) => void
  nextPage: () => void
  prevPage: () => void
  resetPage: () => void
}

export function usePagination({
  totalItems,
  itemsPerPage = 10,
  initialPage = 1
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasNext = currentPage < totalPages
  const hasPrev = currentPage > 1
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems)

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const nextPage = useCallback(() => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasNext])

  const prevPage = useCallback(() => {
    if (hasPrev) {
      setCurrentPage(prev => prev - 1)
    }
  }, [hasPrev])

  const resetPage = useCallback(() => {
    setCurrentPage(1)
  }, [])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  return {
    currentPage,
    totalPages,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    resetPage
  }
}

interface UseFiltersReturn<T> {
  filters: T
  setFilter: (key: keyof T, value: any) => void
  setFilters: (newFilters: Partial<T>) => void
  resetFilters: (initialFilters: T) => void
  clearFilters: () => void
}

export function useFilters<T extends Record<string, any>>(
  initialFilters: T
): UseFiltersReturn<T> {
  const [filters, setFilterState] = useState<T>(initialFilters)

  const setFilter = useCallback((key: keyof T, value: any) => {
    setFilterState(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const setFilters = useCallback((newFilters: Partial<T>) => {
    setFilterState(prev => ({
      ...prev,
      ...newFilters
    }))
  }, [])

  const resetFilters = useCallback((resetToFilters: T) => {
    setFilterState(resetToFilters)
  }, [])

  const clearFilters = useCallback(() => {
    setFilterState(initialFilters)
  }, [initialFilters])

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    clearFilters
  }
}