import { Navigate, Outlet } from 'react-router'
import { useSessionStore } from '@/core/session/store'

function RequireAuth() {
  const authState = useSessionStore((state) => state.authState)
  if (authState === null) return <Navigate to="/login" replace />
  return <Outlet />
}

export default RequireAuth
