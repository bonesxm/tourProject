import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

