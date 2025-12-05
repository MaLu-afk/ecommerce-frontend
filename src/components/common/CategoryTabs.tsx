//src/components/common/CategoryTabs.tsx
import { useEffect, useRef, useState } from 'react'
import { fetchCategorias, type Categoria } from '../../api/categories'

type Props = {
  value: number | null
  onChange: (id: number | null) => void
}

export default function CategoryTabs({ value, onChange }: Props) {
  const [cats, setCats] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    fetchCategorias()
      .then(setCats, (e) => setError(e?.message ?? 'Error cargando categorías'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      e.preventDefault()
      const ids = [null, ...cats.map((c) => c.id)]
      const i = ids.indexOf(value ?? null)
      const next =
        e.key === 'ArrowRight'
          ? ids[(i + 1 + ids.length) % ids.length]
          : ids[(i - 1 + ids.length) % ids.length]
      onChange(next as number | null)
    }
    el.addEventListener('keydown', onKey)
    return () => el.removeEventListener('keydown', onKey)
  }, [cats, value, onChange])

  const Tab = ({
    id,
    label,
    active,
  }: { id: number | null; label: string; active: boolean }) => (
    <button
      type="button"
      onClick={() => onChange(id)}
      aria-pressed={active}
      className={[
        'whitespace-nowrap rounded-full px-4 py-2 text-sm transition',
        active
          ? 'bg-rose-600 text-white'
          : 'bg-rose-100 text-rose-900 hover:bg-rose-200',
      ].join(' ')}
    >
      {label}
    </button>
  )

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Categorías"
      tabIndex={0}
      className="flex gap-3 overflow-x-auto pb-1"
    >
      {loading ? (
        // Skeleton simple
        Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-24 animate-pulse rounded-full bg-rose-100/70"
          />
        ))
      ) : (
        <>
          <Tab id={null} label="Todos" active={value == null} />
          {cats.map((c) => (
            <Tab key={c.id} id={c.id} label={c.nombre} active={value === c.id} />
          ))}
        </>
      )}
    </div>
  )
}
