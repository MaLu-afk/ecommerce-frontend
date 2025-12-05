
// src/components/landing/TopProducts.tsx
import { useEffect, useRef, useState } from 'react'
import { fetchBestSellers } from '../../api/products'
import type { Product } from '../../types/product'
import ProductCard from './ProductCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Breakpoints de Tailwind: sm=640, md=768, lg=1024, xl=1280
function useVisibleCount() {
  const [visible, setVisible] = useState(5)
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth
      if (w < 640) return 1             // <sm
      if (w < 768) return 2             // sm
      if (w < 1024) return 3            // md
      if (w < 1280) return 4            // lg
      return 5                          // xl+
    }
    const onResize = () => setVisible(compute())
    setVisible(compute())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return visible
}

export default function TopProducts() {
  const [items, setItems] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [start, setStart] = useState(0)
  const VISIBLE = useVisibleCount()

  useEffect(() => {
    fetchBestSellers(20).then(
      setItems,
      (e) => setError(e?.message ?? 'Error al cargar productos')
    )
  }, [])

  const disabled = items.length <= VISIBLE

  const getOffset = (i: number) => {
    const n = items.length
    let off = (i - start) % n
    if (off < -n) off += n
    if (off > n) off -= n
    if (off > n / 2) off -= n
    if (off < -n / 2) off += n
    return off
  }

  const next = () => !disabled && setStart(prev => (prev + 1) % items.length)
  const prev = () => !disabled && setStart(prev => (prev - 1 + items.length) % items.length)

  // Swipe táctil
  const startX = useRef<number | null>(null)
  const onPointerDown = (e: React.PointerEvent) => { startX.current = e.clientX }
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return
    const dx = e.clientX - startX.current
    startX.current = null
    const THRESHOLD = 40
    if (dx > THRESHOLD) prev()
    else if (dx < -THRESHOLD) next()
  }

  if (error) return <div className="text-red-600">{error}</div>

  if (!items.length) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] rounded-xl bg-slate-100 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <section className="relative my-6">
      <h2
        className="mb-4 text-center text-2xl font-extrabold tracking-[.20em] uppercase"
        style={{ fontFamily: '"Protest Strike","Inter",sans-serif' }}
      >
        Productos más vendidos
      </h2>

      <div className="relative">
        <div
          className="relative overflow-hidden rounded-2xl"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className="relative h-full min-h-[19rem] sm:min-h-[20rem] md:min-h-[21rem] lg:min-h-[22rem]">
            {items.map((p, i) => {
              const widthPct = 100 / VISIBLE
              const offset = getOffset(i)
              return (
                <div
                  key={p.id}
                  className="absolute inset-y-0 transition-transform duration-500 px-1 sm:px-2"
                  style={{
                    width: `${widthPct}%`,
                    transform: `translateX(${offset * 100}%)`,
                    left: 0,
                  }}
                >
                  <ProductCard p={p} />
                </div>
              )
            })}
          </div>
        </div>

        <button
          onClick={prev}
          disabled={disabled}
          className="absolute left-1 sm:left-2 lg:-left-12 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/40 disabled:opacity-40"
          aria-label="Anterior"
          title="Anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={next}
          disabled={disabled}
          className="absolute right-1 sm:right-2 lg:-right-12 top-1/2 -translate-y-1/2 grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/40 disabled:opacity-40"
          aria-label="Siguiente"
          title="Siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  )
}
