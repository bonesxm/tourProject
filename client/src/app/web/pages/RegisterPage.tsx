import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { http } from '../../shared/api/http'

export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await http.post('/api/auth/register', form)
      navigate('/login')
    } catch (e: any) {
      setError(e?.response?.data?.error?.message || 'Registration failed')
    }
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto w-full max-w-lg premium-card p-6">
        <h1 className="text-2xl font-semibold">Create Account</h1>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm((s) => ({ ...s, fullName: e.target.value }))} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} />
          <input className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Phone" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
          <input type="password" className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} />
          <input type="password" className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm((s) => ({ ...s, confirmPassword: e.target.value }))} />
          {error ? <div className="text-sm text-rose-600">{error}</div> : null}
          <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 font-semibold text-white">Register</button>
        </form>
        <div className="mt-3 text-sm">
          <Link to="/login" className="text-sky-700">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  )
}

