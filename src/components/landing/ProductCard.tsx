import { useNavigate } from 'react-router-dom'
import type { Product } from '../../types/product'
import { formatPriceUSD } from '../../utils/formatPrice'
import { useTracking } from '../../hooks/useTracking'
import type { ContextType } from '../../api/tracking'

interface ProductCardProps {
  p: Product
  trackingContext?: ContextType
}

export default function ProductCard({ p, trackingContext = 'home' }: ProductCardProps) {
  const navigate = useNavigate()
  const { trackProductClick } = useTracking()
  const inStock = (p.stock ?? 0) > 0

  const imgs = Array.isArray(p.imagen_url)
    ? p.imagen_url.filter(Boolean)
    : (p.imagen_url ? [p.imagen_url] : [])

  const cover = imgs[0] ?? '/placeholder.png'
  const descripcion = (p as any).descripcion ?? (p as any).description ?? ''

  const handleClick = () => {
    trackProductClick(p.id, trackingContext)
    navigate(`/producto/${p.id}`)
  }



  return (
    <article
      onClick={handleClick}
      className="group flex flex-col h-full rounded-xl border border-slate-200 bg-white p-3 
                 shadow-sm transition-all duration-300 
                 hover:shadow-xl hover:border-purple-300 hover:-translate-y-1 
                 cursor-pointer active:scale-[0.98]"
    >
      {/* Imagen / Portada */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-50">
        {cover ? (
          <img
            src={cover}
            alt={p.nombre}
            className="h-full w-full object-contain transition-transform duration-500 
                       group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-slate-400">
            Sin imagen
          </div>
        )}

        {/* Indicador de cantidad de imágenes */}
        {imgs.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 
                           text-xs font-medium text-white backdrop-blur-sm
                           transition-all duration-300 group-hover:bg-purple-600/80">
            {imgs.length} fotos
          </span>
        )}

        {/* Overlay sutil al hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent 
                        opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      {/* Estado / reviews */}
      <div className="mt-3 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 font-medium transition-colors
            ${inStock
              ? 'text-emerald-600 group-hover:text-emerald-700'
              : 'text-amber-600 group-hover:text-amber-700'
            }`}
        >
          <span
            className={`h-2 w-2 rounded-full transition-all duration-300
              ${inStock
                ? 'bg-emerald-500 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                : 'bg-amber-500 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.6)]'
              }`}
          />
          {inStock ? 'En Stock' : 'Consultar Disponibilidad'}
        </span>

        {p.recuento_resenas ? (
          <span className="text-slate-400 transition-colors group-hover:text-slate-600">
            · Reviews ({p.recuento_resenas})
          </span>
        ) : null}
      </div>

      {/* Nombre */}
      <h3 className="mt-1 line-clamp-2 text-[13px] sm:text-sm font-semibold 
                     text-slate-800 leading-snug transition-colors
                     group-hover:text-purple-700">
        {p.nombre}
      </h3>

      {/* Descripción */}
      {descripcion && (
        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-snug 
                      line-clamp-2 transition-colors group-hover:text-slate-700">
          {descripcion}
        </p>
      )}

      {/* Precio y botón */}
      <div className="mt-2 sm:mt-3 flex items-center justify-between gap-2 mt-auto">
        <div className="text-lg sm:text-xl font-bold text-slate-900
                        transition-all duration-300 group-hover:text-purple-700">
          {formatPriceUSD(p.precio)}
        </div>
      </div>

      {/* Indicador de especificaciones disponibles */}
      {p.especificaciones && (
        <div className="mt-2 text-xs text-blue-600">
          Ver especificaciones técnicas →
        </div>
      )}
    </article>
  )
}
