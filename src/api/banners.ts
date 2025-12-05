import { http } from './http'
import type { Banner } from '../types/banner'

export async function fetchBanners(): Promise<Banner[]> {
  try {
    // endpoint real del backend
    const { data } = await http.get<Banner[]>('/banners')
    return data
  } catch (error) {
    // Fallback a banners mock cuando falla la conexión
    console.warn('API no disponible, usando banners mock:', error)
    return [
      {
        id: 1,
        imageUrl: '/src/assets/banners/hero-1.png',
        alt: 'Banner promocional 1'
      },
      {
        id: 2,
        imageUrl: '/src/assets/banners/hero-2.png',
        alt: 'Banner promocional 2'
      },
      {
        id: 3,
        imageUrl: '/src/assets/banners/hero-3.png',
        alt: 'Banner promocional 3'
      }
    ]
  }
}
