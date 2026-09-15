import { Navigate, Outlet } from 'react-router'
import { useSessionStore } from '@/core/session/store'

function RequireAnonymous() {
  const authState = useSessionStore((state) => state.authState)
  if (authState !== null) return <Navigate to="/" replace />
  return <Outlet />
}

export default RequireAnonymous
