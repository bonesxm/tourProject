import { useEffect, useState } from 'react'
import { http } from '../../shared/api/http'
import { useAuth } from '../../shared/auth/AuthContext'

export function UserDashboardPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const notifications: any[] = []

  useEffect(() => {
    void http.get('/api/bookings/my').then((r) => setBookings(r.data.items || [])).catch(() => {})
    void http
      .get('/api/auth/me')
      .then(() => {})
      .catch(() => {})
  }, [])

  return (
    <div className="container-page py-12">
      <h1 className="section-title">User Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Welcome, {user?.fullName}. Manage your profile, bookings, favorites, notifications, and AI
        assistant.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        {[
          ['Booking history', String(bookings.length)],
          ['Favorite tours', '0'],
          ['Saved hotels', '0'],
          ['Notifications', String(notifications.length)],
        ].map(([k, v]) => (
          <div key={k} className="premium-card p-5">
            <p className="text-sm text-slate-500">{k}</p>
            <p className="mt-2 text-2xl font-semibold">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 premium-card p-5">
        <h2 className="text-lg font-semibold">Recent Bookings</h2>
        <div className="mt-3 overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="p-2">ID</th>
                <th className="p-2">Status</th>
                <th className="p-2">Total</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-slate-200/70 dark:border-slate-700/70">
                  <td className="p-2">{b.id.slice(0, 8)}</td>
                  <td className="p-2">{b.status}</td>
                  <td className="p-2">${b.total_usd}</td>
                  <td className="p-2">{new Date(b.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!bookings.length ? (
                <tr>
                  <td className="p-3 text-slate-500" colSpan={4}>
                    No bookings yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

