import { Navigate, Outlet } from 'react-router'
import { useSessionStore } from '@/core/session/store'
import UnlockScreen from '@/features/auth/UnlockScreen'
import { useRef } from 'react'

function InactivityLock() {
  const lockSession = useSessionStore((state) => state.lockSession)
  const authState = useSessionStore((state) => state.authState)

  const limitInactivityTime = 15 * 60 * 1000 // 15 minutes

  const lastActivityAt = useRef(Date.now())
  lastActivityAt.current = Date.now()

  
  if (authState === null) return <Navigate to="/login" replace />

  if (Date.now() - lastActivityAt.current > limitInactivityTime){
    lockSession()
  }

  return (<>
        <Outlet />
        {authState.isLocked && <UnlockScreen />}
    </>)  
}

export default InactivityLock
