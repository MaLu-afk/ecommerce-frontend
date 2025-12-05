export function formatPriceUSD(input: number | string): string {
  const n = typeof input === 'string' ? Number(input) : input
  const value = Number.isFinite(n) ? n : 0
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Útil para labels del filtro (sin decimales)
export function formatPriceUSD0(input: number | string): string {
  const n = typeof input === 'string' ? Number(input) : input
  const value = Number.isFinite(n) ? n : 0
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
