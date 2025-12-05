import { http } from './http'

export type Categoria = { id: number; nombre: string }

export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    const { data } = await http.get<Categoria[]>('/categorias', {
    })
    return [...data].sort((a, b) => a.nombre.localeCompare(b.nombre))
  } catch (error) {
    // Fallback a categorías mock cuando falla la conexión
    console.warn('API no disponible, usando categorías mock:', error)
    return [
      { id: 1, nombre: 'Electrónicos' },
      { id: 2, nombre: 'Laptops' },
      { id: 3, nombre: 'Smartphones' },
      { id: 4, nombre: 'Accesorios' },
    ].sort((a, b) => a.nombre.localeCompare(b.nombre))
  }
}
