import { Center, Loader } from '@mantine/core'
import { Navigate, Outlet } from 'react-router'
import { useSessionStore } from '@/core/session/store'

function RequirePasswordChanged() {
  const authState = useSessionStore((state) => state.authState)
  const isRestoring = useSessionStore((state) => state.isRestoring)
  if (isRestoring) {
    return (
      <Center h="100vh">
        <Loader />
      </Center>
    )
  }
  if (authState === null) return <Navigate to="/login" replace />
  if (authState.mustChangePassword) return <Navigate to="/set-password" replace />
  return <Outlet />
}

export default RequirePasswordChanged
