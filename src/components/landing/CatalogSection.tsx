import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { SearchX } from 'lucide-react'
import CategoryTabs from '../common/CategoryTabs'
import FilterPanel from '../common/FilterPanel'
import ProductCard from './ProductCard'
import {
  getProducts,
  type Product,
  type ProductQuery,
  type Page,
} from '../../api/products'

/** ===== Config de rendimiento ===== */
const CACHE_TTL_MS = 30_000   // 30s de caché en memoria
const PER_PAGE = 15           // 5 + 10

export default function CatalogSection() {
  const [items, setItems] = useState<Product[]>([])
  const [meta, setMeta] = useState<Page<Product>['meta']>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  /** ====== ESTADOS APLICADOS (los que consulta la API) ====== */
  const [categoriaId, setCategoriaId] = useState<number | null>(null)
  const [q, setQ] = useState('')
  const [min, setMin] = useState(0)
  const [max, setMax] = useState(10000)
  const [page, setPage] = useState(1)

  /** ====== ESTADOS BORRADOR (lo que el usuario mueve en el panel) ====== */
  const [dCategoriaId, setDCategoriaId] = useState<number | null>(categoriaId)
  const [dQ, setDQ] = useState(q)
  const [dMin, setDMin] = useState(min)
  const [dMax, setDMax] = useState(max)

  // Disparar fetch solo al aplicar o cambiar de página
  const [applyTick, setApplyTick] = useState(0)

  // Drawer móvil
  const [openFilters, setOpenFilters] = useState(false)
  const openFiltersSync = () => {
    // Sincroniza borradores con lo aplicado al abrir el drawer
    setDCategoriaId(categoriaId)
    setDQ(q)
    setDMin(min)
    setDMax(max)
    setOpenFilters(true)
  }

  // Refs para control de concurrencia y caché
  const requestId = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const cacheRef = useRef<Map<string, { ts: number; res: Page<Product> }>>(new Map())

  const TOP_COUNT = 5
  const MORE_COUNT = 10

  const makeKey = (p: ProductQuery) => JSON.stringify(p)

  const fetchData = useCallback(async () => {
    const params: ProductQuery = {
      q: q || undefined,
      categoria_id: categoriaId ?? undefined,
      min_price: min || undefined,
      max_price: max || undefined,
      sort: 'nombre',
      dir: 'asc',
      page,
      per_page: PER_PAGE,
    }
    const key = makeKey(params)

    // 1) Caché fresca
    const now = Date.now()
    const cached = cacheRef.current.get(key)
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      setLoading(false)
      setError(null)
      setItems(cached.res.data ?? [])
      setMeta(cached.res.meta)
      return
    }

    // 2) Cancelar petición previa si existe
    if (abortRef.current) {
      try { abortRef.current.abort() } catch { }
    }
    const ac = new AbortController()
    abortRef.current = ac

    // 3) Loading y limpieza visual para evitar residuos
    const myId = ++requestId.current
    setLoading(true)
    setError(null)
    setItems([])

    try {
      const res = await getProducts(params as any) // integra { signal: ac.signal } si tu http lo soporta

      if (myId !== requestId.current || ac.signal.aborted) return

      let list = Array.isArray(res.data) ? res.data : []

      // 4) Fallback en cliente solo si meta no viene del backend
      if (!res.meta) {
        const norm = (s: any) =>
          String(s ?? '')
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .toLowerCase()
        const qn = norm(q)
        list = list.filter((p: any) => {
          const price = Number(p?.precio ?? p?.price ?? 0)
          const name = norm(p?.nombre ?? p?.name)
          const brand = norm(
            p?.especificaciones?.caracteristicas_principales?.Marca ??
            p?.especificaciones?.marca
          )
          const cat = Number(p?.categoria_id ?? p?.categoriaId)
          const matchQ = qn ? name.includes(qn) || brand.includes(qn) : true
          const matchCat = categoriaId != null ? cat === categoriaId : true
          const matchPrice = price >= (min ?? 0) && price <= (max ?? 10000)
          return matchQ && matchCat && matchPrice
        })
      }

      // 5) Meta consistente
      const m = res.meta ?? {
        current_page: page,
        last_page: 1,
        per_page: list.length,
        total: list.length,
      }

      // 6) Cachear y setear estado
      const packed: Page<Product> = { data: list, meta: m, links: res.links }
      cacheRef.current.set(key, { ts: now, res: packed })

      setItems(list)
      setMeta(m)
      setError(null)
    } catch (e: any) {
      if (myId !== requestId.current || ac.signal.aborted) return
      setError(e?.message ?? 'Error cargando productos')
    } finally {
      if (myId === requestId.current) setLoading(false)
    }
  }, [q, categoriaId, min, max, page])

  // Dispara solo al aplicar o cambiar de página
  useEffect(() => { fetchData() }, [applyTick, page, fetchData])

  /** ====== ACCIONES ====== */
  // Copia BORRADOR -> APLICADO y consulta
  const apply = () => {
    setCategoriaId(dCategoriaId)
    setQ(dQ)
    setMin(dMin)
    setMax(dMax)
    setPage(1)
    setApplyTick(t => t + 1)
    setOpenFilters(false)
  }
  const onApply = apply

  // Limpia solo el BORRADOR (si quieres que aplique inmediatamente, llama onApply() después)
  const onClear = () => {
    setDQ('')
    setDMin(0)
    setDMax(10000)
    setDCategoriaId(null)
  }

  // Cortes (cuando items ya está listo)
  const topFive = useMemo(() => items.slice(0, TOP_COUNT), [items])
  const moreTen = useMemo(() => items.slice(TOP_COUNT, TOP_COUNT + MORE_COUNT), [items])

  // Paginación
  const lastPage = Math.max(1, meta?.last_page ?? 1)
  const currentPage = Math.min(page, lastPage)
  const makePages = (current: number, last: number) => {
    const base = new Set<number>([1, 2, last - 1, last, current - 1, current, current + 1])
    const arr = [...base].filter(n => n >= 1 && n <= last).sort((a, b) => a - b)
    const out: (number | '...')[] = []
    for (let i = 0; i < arr.length; i++) {
      if (i === 0) out.push(arr[i])
      else {
        if (arr[i] - arr[i - 1] > 1) out.push('...', arr[i])
        else out.push(arr[i])
      }
    }
    return out
  }
  const go = (n: number) => setPage(n)

  return (
    <section className="space-y-6">
      <h2
        className="mt-6 text-center text-2xl sm:text-3xl font-extrabold tracking-[.20em] uppercase"
        style={{ fontFamily: '"Protest Strike","Inter",sans-serif' }}
      >
        Catálogo de productos
      </h2>

      {/* Categorías */}
      <div className="mt-2">
        <div className="flex justify-center">
          <div className="w-full sm:w-auto overflow-x-auto no-scrollbar">
            <div className="min-w-max sm:min-w-0 px-1 sm:px-0 flex justify-center">
              <CategoryTabs
                value={dCategoriaId}                    // 👈 usa BORRADOR
                onChange={(id) => setDCategoriaId(id)}  // 👈 no aplica automáticamente
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout: sidebar md+ / drawer móvil */}
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-[18rem_1fr]">
        {/* Botón filtros móvil */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <button
              onClick={openFiltersSync}                 // 👈 sincroniza y abre
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50"
              aria-label="Abrir filtros"
            >
              Filtros
            </button>
          </div>
        </div>

        {/* Sidebar desktop */}
        <aside className="hidden md:block">
          <div className="md:sticky md:top-24">
            <FilterPanel
              productsForBrand={items}
              // 👇 Panel opera sobre BORRADORES
              q={dQ} setQ={setDQ}
              min={dMin} max={dMax}
              setMin={setDMin} setMax={setDMax}
              onApply={onApply} onClear={onClear}
            />
          </div>
        </aside>

        {/* Contenido */}
        <div className="space-y-8">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Loading skeletons para TODO el bloque */}
          {loading && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={`sk-top-${i}`} className="aspect-[4/5] animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="text-base sm:text-lg font-semibold">Más Productos</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={`sk-more-${i}`} className="aspect-[4/5] animate-pulse rounded-xl bg-slate-100" />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Vacío */}
          {!loading && items.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-16">
              <SearchX className="h-12 w-12 text-slate-400" />
              <p className="mt-3 text-slate-600 text-center">
                No se encontraron productos con los filtros actuales.
              </p>
              <button
                onClick={() => { onClear(); onApply(); }}  // limpiar borrador y aplicar
                className="mt-4 rounded-full border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Resultado listo (se pinta TODO junto) */}
          {!loading && items.length > 0 && (
            <>
              {/* usa topFive */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                {topFive.map((p) => (
                  <ProductCard
                    key={p.id}
                    p={p}
                    trackingContext={q ? 'search' : 'home'}
                  />
                ))}
              </div>

              {/* usa moreTen */}
              {items.length > TOP_COUNT && (
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold">Más Productos</h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-5">
                    {moreTen.map((p) => (
                      <ProductCard
                        key={`more-${p.id}`}
                        p={p}
                        trackingContext={q ? 'search' : 'home'}
                      />
                    ))}
                  </div>
                </div>
              )}

              {(meta?.last_page ?? 1) > 1 && (
                <nav className="mt-2 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación de catálogo">
                  <button
                    onClick={() => go(Math.max(1, currentPage - 1))}
                    className="h-9 rounded-full border px-3 text-sm hover:bg-gray-50 disabled:opacity-40"
                    disabled={currentPage <= 1}
                  >
                    Anterior
                  </button>

                  <div className="flex items-center gap-1">
                    {makePages(currentPage, lastPage).map((t, idx) =>
                      t === '...' ? (
                        <span key={`ellipsis-${idx}`} className="select-none px-2 text-gray-500">…</span>
                      ) : (
                        <button
                          key={t}
                          onClick={() => go(t)}
                          className={`h-9 w-9 rounded-full border text-sm ${t === currentPage ? 'bg-rose-600 text-white border-rose-600' : 'hover:bg-gray-50'
                            }`}
                          aria-current={t === currentPage ? 'page' : undefined}
                          aria-label={`Ir a la página ${t}`}
                        >
                          {t}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => go(Math.min(lastPage, currentPage + 1))}
                    className="h-9 rounded-full border px-3 text-sm hover:bg-gray-50 disabled:opacity-40"
                    disabled={currentPage >= lastPage}
                  >
                    Siguiente
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      {/* Drawer móvil */}
      {openFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpenFilters(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            className="absolute right-0 top-0 h-full w-80 max-w-[88%] bg-white shadow-xl p-4 overflow-y-auto"
          >
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-base font-semibold">Filtros</h4>
              <button
                onClick={() => setOpenFilters(false)}
                className="rounded-md px-3 py-1 text-sm hover:bg-gray-100"
              >
                Cerrar
              </button>
            </div>

            <FilterPanel
              productsForBrand={items}
              q={dQ} setQ={setDQ}
              min={dMin} max={dMax}
              setMin={setDMin} setMax={setDMax}
              onApply={onApply}
              onClear={onClear}
            />
          </div>
        </div>
      )}
    </section>
  )
}
