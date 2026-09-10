import { Navigate, Outlet } from 'react-router'
import { useSessionStore } from '@/core/session/store'
import ForbiddenPage from '@/core/routing/ForbiddenPage'

function RequirePermission({ permission }: { permission: string }) {
  const authState = useSessionStore((state) => state.authState)
  if (authState === null) return <Navigate to="/login" replace />
  if (authState.permissions && authState.permissions.has(permission)) {
    return <Outlet />
  }
  return <ForbiddenPage />
}

export default RequirePermission
