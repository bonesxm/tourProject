import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { http } from '../../shared/api/http'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const [token, setToken] = useState(params.get('token') || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await http.post('/api/auth/reset-password', { token, password, confirmPassword })
    setMessage('Password reset successful. You can login now.')
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto w-full max-w-md premium-card p-6">
        <h1 className="text-2xl font-semibold">Reset Password</h1>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Reset token" value={token} onChange={(e) => setToken(e.target.value)} />
          <input type="password" className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input type="password" className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white dark:bg-white dark:text-slate-900">Update Password</button>
        </form>
        {message ? <p className="mt-3 text-sm text-emerald-600">{message}</p> : null}
      </div>
    </div>
  )
}

