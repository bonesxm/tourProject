import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { http } from '../../shared/api/http'
import { useAuth } from '../../shared/auth/AuthContext'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('user@smarttourism.local')
  const [password, setPassword] = useState('User123!')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { data } = await http.post('/api/auth/login', { email, password })
      login({
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.fullName,
          role: 'user',
          phone: data.user.phone,
        },
        accessToken: data.tokens.accessToken,
      })
      navigate('/dashboard')
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto w-full max-w-md premium-card p-6">
        <h1 className="text-2xl font-semibold">User Login</h1>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input type="password" className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          <button disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white dark:bg-white dark:text-slate-900">Login</button>
        </form>
        <div className="mt-3 flex justify-between text-sm">
          <Link to="/register" className="text-sky-700">Create account</Link>
          <Link to="/forgot-password" className="text-sky-700">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}

