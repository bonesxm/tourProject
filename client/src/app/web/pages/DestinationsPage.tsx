import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { http } from '../../shared/api/http'
import type { Destination } from '../../shared/api/types'

export function DestinationsPage() {
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Destination[]>([])
  const [error, setError] = useState<string | null>(null)

  const trimmedQ = useMemo(() => q.trim(), [q])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data } = await http.get('/api/destinations', {
          params: { q: trimmedQ || undefined, limit: 24, offset: 0 },
        })
        if (cancelled) return
        setItems(data.items ?? [])
      } catch (e) {
        if (cancelled) return
        setError('Failed to load destinations. Is the backend running on port 8085?')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [trimmedQ])

  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Destination Guides</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Explore photo-rich destinations, travel style inspiration, and best seasonal deals.
          </p>
        </div>
        <Link
          to="/tours"
          className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Explore tours
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="glass flex flex-1 items-center gap-2 rounded-2xl px-4 py-3 shadow-sm">
          <Search className="size-4 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            placeholder="Search by city, country, or destination name..."
          />
        </div>
        <a
          href="/api/destinations"
          className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
        >
          Open API JSON
        </a>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950"
              />
            ))
          : items.map((d) => (
              <Link
                key={d.id}
                to={`/destinations/${d.slug}`}
                className="premium-card group p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold">{d.title}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {d.city ? `${d.city}, ` : ''}
                      {d.country}
                    </div>
                  </div>
                  <div className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    {Number(d.rating).toFixed(1)}
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
                  {d.description || 'Explore curated experiences and book in minutes.'}
                </p>
                <div className="mt-5 flex items-center justify-between text-sm">
                  <div className="text-slate-600 dark:text-slate-400">
                    From{' '}
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ${d.price_from_usd}
                    </span>
                  </div>
                  <div className="text-brand-700 transition group-hover:translate-x-0.5 dark:text-brand-400">
                    View →
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </div>
  )
}

