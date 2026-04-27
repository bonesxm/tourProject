import { useState } from 'react'
import { http } from '../../shared/api/http'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [tokenHint, setTokenHint] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { data } = await http.post('/api/auth/forgot-password', { email })
    setTokenHint(data.resetToken ? `Reset token (demo): ${data.resetToken}` : 'If account exists, reset link sent.')
  }

  return (
    <div className="container-page py-14">
      <div className="mx-auto w-full max-w-md premium-card p-6">
        <h1 className="text-2xl font-semibold">Forgot Password</h1>
        <form onSubmit={onSubmit} className="mt-4 grid gap-3">
          <input className="rounded-xl border border-slate-200 px-3 py-2 dark:border-slate-700 dark:bg-slate-900" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="rounded-xl bg-slate-900 px-4 py-2 font-semibold text-white dark:bg-white dark:text-slate-900">Send Reset Link</button>
        </form>
        {tokenHint ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{tokenHint}</p> : null}
      </div>
    </div>
  )
}

