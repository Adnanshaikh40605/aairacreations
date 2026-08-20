import type { ReactNode } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.tsx'

export interface GuardProps {
  children?: ReactNode
}

export function RequireAuth({ children }: GuardProps) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return (
      <div className="app-frame flex min-h-[100dvh] items-center justify-center bg-canvas">
        <div className="skeleton h-10 w-40 rounded-xl" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children ? <>{children}</> : <Outlet />
}

export function RequireOwner({ children }: GuardProps) {
  const { user } = useAuth()
  if (user?.role !== 'owner') {
    return (
      <div className="px-4 py-10 text-center text-mute">
        Owner only.{' '}
        <Link to="/" className="text-accent">
          Back home
        </Link>
      </div>
    )
  }
  return children ? <>{children}</> : <Outlet />
}
