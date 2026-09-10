import { Navigate, Outlet } from 'react-router'
import { useSessionStore } from '@/core/session/store'

function RequirePasswordChanged() {
  const authState = useSessionStore((state) => state.authState)
  if (authState === null) return <Navigate to="/login" replace />
  if (authState.mustChangePassword) return <Navigate to="/change-password" replace />
  return <Outlet />
}

export default RequirePasswordChanged
