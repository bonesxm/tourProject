import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { http } from '../api/http'

type Role = 'user' | 'admin'

type AuthUser = {
  id: string
  email: string
  fullName: string
  role: Role
  phone?: string
}

type AuthState = {
  user: AuthUser | null
  accessToken: string | null
}

type AuthContextValue = AuthState & {
  isAuthenticated: boolean
  login: (payload: { user: AuthUser; accessToken: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readInitial(): AuthState {
  const raw = localStorage.getItem('stp_auth')
  if (!raw) return { user: null, accessToken: null }
  try {
    return JSON.parse(raw)
  } catch {
    return { user: null, accessToken: null }
  }
}

function persist(state: AuthState) {
  localStorage.setItem('stp_auth', JSON.stringify(state))
  if (state.accessToken) {
    http.defaults.headers.common.Authorization = `Bearer ${state.accessToken}`
  } else {
    delete http.defaults.headers.common.Authorization
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const initial = readInitial()
    persist(initial)
    return initial
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      isAuthenticated: Boolean(state.user && state.accessToken),
      login: ({ user, accessToken }) => {
        const next = { user, accessToken }
        setState(next)
        persist(next)
      },
      logout: () => {
        const next = { user: null, accessToken: null }
        setState(next)
        persist(next)
      },
    }),
    [state],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

