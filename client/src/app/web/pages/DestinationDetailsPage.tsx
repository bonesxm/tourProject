import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { http } from '../../shared/api/http'
import type { Destination } from '../../shared/api/types'

export function DestinationDetailsPage() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState<Destination | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!slug) return
      setLoading(true)
      setError(null)
      try {
        const { data } = await http.get(`/api/destinations/${slug}`)
        if (cancelled) return
        setItem(data.item ?? null)
      } catch {
        if (cancelled) return
        setError('Destination not found or backend is not reachable.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <div className="container-page py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {loading ? 'Loading…' : item?.title || 'Destination'}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {item?.city ? `${item.city}, ` : ''}
            {item?.country || ''}
          </p>
        </div>
        <Link
          to="/destinations"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
        >
          Back
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
            <div className="text-sm font-semibold">Overview</div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {item?.description ||
                'We are preparing tours, hotels, and best offers for this destination.'}
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
          <div className="text-sm font-semibold">Quick facts</div>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center justify-between">
              <span>Rating</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {item ? Number(item.rating).toFixed(1) : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Price from</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {item ? `$${item.price_from_usd}` : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Slug</span>
              <span className="font-mono text-xs">{slug}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

