import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { useEffect, useState } from 'react'
import { http } from '../../shared/api/http'

const data = [
  { month: 'Jan', bookings: 120, revenue: 34000 },
  { month: 'Feb', bookings: 180, revenue: 42000 },
  { month: 'Mar', bookings: 220, revenue: 56000 },
  { month: 'Apr', bookings: 260, revenue: 62000 },
]

export function AdminPage() {
  const [stats, setStats] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [aiLogs, setAiLogs] = useState<any[]>([])

  useEffect(() => {
    void Promise.all([
      http.get('/api/admin/stats'),
      http.get('/api/admin/users'),
      http.get('/api/admin/bookings'),
      http.get('/api/admin/reviews'),
      http.get('/api/admin/ai-logs'),
    ])
      .then(([s, u, b, r, l]) => {
        setStats(s.data)
        setUsers(u.data.items || [])
        setBookings(b.data.items || [])
        setReviews(r.data.items || [])
        setAiLogs(l.data.items || [])
      })
      .catch(() => {})
  }, [])

  return (
    <div className="container-page py-12">
      <h1 className="section-title">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Manage users, tours, hotels, bookings, and platform analytics.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ['Total users', String(stats?.cards?.totalUsers ?? 0)],
          ['Total bookings', String(stats?.cards?.totalBookings ?? 0)],
          ['Revenue', `$${stats?.cards?.revenueUsd ?? 0}`],
          ['Popular destination', String(stats?.popularDestinations?.[0]?.title || '—')],
        ].map(([k, v]) => (
          <div key={k} className="premium-card p-5">
            <p className="text-sm text-slate-500">{k}</p>
            <p className="mt-2 text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 premium-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Bookings & Revenue Trend</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="bookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.7} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <Tooltip />
              <Area type="monotone" dataKey="bookings" stroke="#0ea5e9" fill="url(#bookings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="premium-card p-5">
          <h2 className="text-lg font-semibold">Client Database</h2>
          <div className="mt-3 max-h-72 overflow-auto text-sm">
            {users.slice(0, 12).map((u) => (
              <div key={u.id} className="flex items-center justify-between border-b border-slate-200/70 py-2 dark:border-slate-700/70">
                <div>
                  <div className="font-medium">{u.full_name}</div>
                  <div className="text-slate-500">{u.email}</div>
                </div>
                <div className="text-xs">{u.is_blocked ? 'Blocked' : 'Active'}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="premium-card p-5">
          <h2 className="text-lg font-semibold">Bookings Management</h2>
          <div className="mt-3 max-h-72 overflow-auto text-sm">
            {bookings.slice(0, 12).map((b) => (
              <div key={b.id} className="flex items-center justify-between border-b border-slate-200/70 py-2 dark:border-slate-700/70">
                <div>
                  <div className="font-medium">{b.full_name}</div>
                  <div className="text-slate-500">{b.status}</div>
                </div>
                <div>${b.total_usd}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="premium-card p-5">
          <h2 className="text-lg font-semibold">Reviews Management</h2>
          <div className="mt-3 max-h-72 overflow-auto text-sm">
            {reviews.slice(0, 10).map((r) => (
              <div key={r.id} className="border-b border-slate-200/70 py-2 dark:border-slate-700/70">
                <div className="font-medium">{r.full_name}</div>
                <div className="text-slate-500">{r.text || 'No text'}</div>
              </div>
            ))}
          </div>
        </section>
        <section className="premium-card p-5">
          <h2 className="text-lg font-semibold">AI Assistant Logs</h2>
          <div className="mt-3 max-h-72 overflow-auto text-sm">
            {aiLogs.slice(0, 10).map((l) => (
              <div key={l.id} className="border-b border-slate-200/70 py-2 dark:border-slate-700/70">
                <div className="font-medium">{l.email || 'Guest'}</div>
                <div className="text-slate-500 line-clamp-2">{l.message}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

