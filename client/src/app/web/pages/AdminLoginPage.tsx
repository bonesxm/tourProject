import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { http } from '../../shared/api/http'
import { useAuth } from '../../shared/auth/AuthContext'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('admin@smarttourism.local')
  const [password, setPassword] = useState('Admin123!')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const { data } = await http.post('/api/admin/auth/login', { email, password })
      login({
        user: {
          id: data.admin.id,
          email: data.admin.email,
          fullName: data.admin.fullName,
          role: 'admin',
        },
        accessToken: data.tokens.accessToken,
      })
      navigate('/admin')
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Admin login failed')
    }
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto w-full max-w-md premium-card p-6">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Admin Email" />
          <input type="password" className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          <button className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 font-semibold text-white">Login as Admin</button>
        </form>
      </div>
    </div>
  )
}

