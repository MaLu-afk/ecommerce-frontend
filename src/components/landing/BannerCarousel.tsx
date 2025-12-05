import { useEffect, useMemo, useRef, useState } from 'react'

type LocalBanner = { id: string; url: string }

export default function BannerCarousel() {
  // Carga todas las imágenes de src/assets/banners/* (png/jpg/webp/jpeg)
  const banners = useMemo<LocalBanner[]>(() => {
    const files = import.meta.glob('@/assets/banners/*.{png,jpg,jpeg,webp}', {
      eager: true, as: 'url'
    }) as Record<string, string>
    return Object.keys(files).map((k) => ({ id: k, url: files[k] }))
  }, [])

  const [idx, setIdx] = useState(0)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (!banners.length) return
    timer.current = window.setInterval(() => setIdx(i => (i + 1) % banners.length), 5000)
    return () => { if (timer.current) window.clearInterval(timer.current) }
  }, [banners.length])

  if (!banners.length) return null

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Alto pensado para el mock */}
      <div className="h-40 md:h-56 lg:h-64 xl:h-[316px]">
        <div className="relative h-full w-full">
          {banners.map((b, i) => {
            const x = (i - idx) * 100
            return (
              <img
                key={b.id}
                src={b.url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700"
                style={{ transform: `translateX(${x}%)` }}
              />
            )
          })}
        </div>
      </div>

      {/* Controles */}
      <button
        onClick={() => setIdx(i => (i - 1 + banners.length) % banners.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/40"
        aria-label="Anterior"
      >‹</button>
      <button
        onClick={() => setIdx(i => (i + 1) % banners.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/30 text-white backdrop-blur hover:bg-black/40"
        aria-label="Siguiente"
      >›</button>

      {/* Dots */}
      <div className="absolute bottom-3 left-4 flex gap-2">
        {banners.map((_, i) => (
          <span key={i} className={`h-1.5 w-6 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'}`} />
        ))}
      </div>
    </div>
  )
}
