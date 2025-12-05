//src/components/common/FilterPanel.tsx
import { useEffect, useMemo, useState } from 'react'
import type { Product } from '../../api/products'
import RangeSlider from '../../utils/RangeSlider'
import { formatPriceUSD0 } from '../../utils/formatPrice'

type Props = {
  productsForBrand?: Product[]
  q: string
  setQ: (s: string) => void
  min: number
  max: number
  setMin: (n: number) => void
  setMax: (n: number) => void
  onApply: () => void
  onClear: () => void
}

const MIN_LIMIT = 0
const MAX_LIMIT = 10000
const STEP = 10

export default function FilterPanel({
  productsForBrand = [],
  q, setQ,
  min, max, setMin, setMax,
  onApply, onClear,
}: Props) {
  // Derivar marcas (máx 10)
  const brands = useMemo(() => {
    const set = new Set<string>()
    productsForBrand.forEach((p) => {
      const m =
        p?.especificaciones?.caracteristicas_principales?.Marca ??
        p?.especificaciones?.marca
      if (m && typeof m === 'string') set.add(m)
    })
    return Array.from(set).slice(0, 10)
  }, [productsForBrand])

  const [selectedBrand, setSelectedBrand] = useState<string>('')

  // Al elegir marca solo actualizamos q; NO aplicamos aún
  useEffect(() => { setQ(selectedBrand) }, [selectedBrand, setQ])

  const clearBrand = () => setSelectedBrand('')

  const clamp = (v: number) =>
    Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, Number.isFinite(v) ? v : 0))

  return (
    <aside className="w-full md:w-64 rounded-xl border bg-rose-50/40 p-4 sm:p-5">
      <h3 className="mb-4 text-center text-base sm:text-lg font-semibold">Filtros</h3>

      {/* Buscar */}
      <div className="mb-5">
        <label htmlFor="q" className="text-sm font-semibold">Buscar</label>
        <input
          id="q"
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Nombre, modelo..."
          onKeyDown={(e) => { if (e.key === 'Enter') onApply() }}
          className="mt-2 w-full rounded-md border px-3 py-2 text-sm sm:text-base outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      {/* Marca */}
      <div className="mb-5">
        <p className="text-sm font-semibold mb-2">Marca</p>
        <div className="space-y-1 max-h-44 overflow-auto md:max-h-none pr-1">
          {brands.length === 0 && <p className="text-xs text-slate-500">—</p>}
          {brands.map((b) => (
            <label key={b} className="flex items-center gap-2 text-sm py-1">
              <input
                type="radio"
                name="brand"
                checked={selectedBrand === b}
                onChange={() => setSelectedBrand(b)}   
                className="h-4 w-4"
              />
              {b}
            </label>
          ))}
          {selectedBrand && (
            <button
              type="button"
              className="mt-1 text-xs text-rose-700 underline"
              onClick={clearBrand}                  
            >
              Limpiar marca
            </button>
          )}
        </div>
      </div>

      {/* Precio (doble slider) */}
      <div className="mb-5">
        <p className="text-sm font-semibold">Precio</p>

        <div className="mt-1 flex items-center justify-between text-xs text-slate-600">
          <span>Mínimo <strong>{formatPriceUSD0(min)}</strong></span>
          <span>Máximo <strong>{formatPriceUSD0(max)}</strong></span>
        </div>

        <div className="mt-3">
          <RangeSlider
            min={MIN_LIMIT}
            max={MAX_LIMIT}
            step={STEP}
            value={[min, max]}
            onChange={([lo, hi]) => {
              const safeLo = Math.max(MIN_LIMIT, Math.min(hi - STEP, lo))
              const safeHi = Math.min(MAX_LIMIT, Math.max(safeLo + STEP, hi))
              setMin(safeLo)
              setMax(safeHi)
            }}
          />
        </div>

        {/* Ajuste fino con inputs numéricos */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min" className="block text-xs text-slate-600">Desde</label>
            <input
              id="min"
              type="number"
              step={STEP}
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              value={min}
              onChange={(e) => {
                const v = clamp(Number(e.target.value || 0))
                setMin(Math.min(v, max - STEP))
              }}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
          <div>
            <label htmlFor="max" className="block text-xs text-slate-600">Hasta</label>
            <input
              id="max"
              type="number"
              step={STEP}
              min={MIN_LIMIT}
              max={MAX_LIMIT}
              value={max}
              onChange={(e) => {
                const v = clamp(Number(e.target.value || 0))
                setMax(Math.max(v, min + STEP))
              }}
              className="mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-300"
            />
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-4 space-y-2">
        <button
          type="button"
          className="w-full rounded-md bg-rose-600 py-2.5 text-white text-sm sm:text-base hover:bg-rose-700"
          onClick={onApply}  
        >
          Aplicar filtro
        </button>
        <button
          type="button"
          className="w-full rounded-md border bg-white py-2.5 text-rose-700 text-sm sm:text-base hover:bg-rose-50"
          onClick={() => { clearBrand(); onClear() }}
        >
          Limpiar filtro
        </button>
      </div>
    </aside>
  )
}
