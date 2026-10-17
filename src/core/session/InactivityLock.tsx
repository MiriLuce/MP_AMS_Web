import { Outlet } from 'react-router'
import { Modal } from '@mantine/core'
import type { ApiError } from '@/core/api/errors'
import { refreshSession } from '@/core/session/refreshSession'
import { useSessionStore } from '@/core/session/store'
import UnlockScreen from '@/features/auth/UnlockScreen'
import { logout } from '@/features/auth/api'
import { useEffect, useRef } from 'react'

const LIMIT_INACTIVITY_TIME = 15 * 60 * 1000
const RENEW_BEFORE_EXPIRY = 5 * 60 * 1000

const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'popstate', // browser back/forward buttons
  'visibilitychange',
  'focus',
] as const

function InactivityLock() {
  const lockSession = useSessionStore((state) => state.lockSession)
  const endSession = useSessionStore((state) => state.endSession)
  const sessionRenewed = useSessionStore((state) => state.sessionRenewed)
  const isLocked = useSessionStore((state) => state.authState?.isLocked ?? false)

  const lastActivityAt = useRef<number | null>(null)

  useEffect(() => {
    const isInactive = () =>
      lastActivityAt.current !== null && Date.now() - lastActivityAt.current > LIMIT_INACTIVITY_TIME

    const checkSession = () => {
      const authState = useSessionStore.getState().authState
      if (authState === null) return false
      if (Date.now() >= authState.expiresAt) {
        endSession('expired')
        return false
      }
      if (authState.isLocked) return false
      if (isInactive()) {
        lockSession()
        logout().catch(() => {})
        return false
      }
      return true
    }

    const renewIfExpiring = () => {
      const expiresAt = useSessionStore.getState().authState?.expiresAt
      if (expiresAt === undefined || expiresAt - Date.now() >= RENEW_BEFORE_EXPIRY) return
      refreshSession().then(sessionRenewed, (error: ApiError) => {
        if (error.kind === 'unauthenticated') endSession('expired')
      })
    }

    const markActivity = () => {
      if (checkSession()) {
        lastActivityAt.current = Date.now()
      }
    }
    lastActivityAt.current = Date.now()

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, markActivity, { passive: true })
    })

    const intervalId = window.setInterval(() => {
      if (checkSession()) renewIfExpiring()
    }, 20_000)

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, markActivity)
      })
      clearInterval(intervalId)
    }
  }, [lockSession, endSession, sessionRenewed, isLocked])

  return (
    <>
      <Outlet />
      <Modal
        opened={isLocked}
        onClose={() => {}} // cannot close the modal, user must unlock the session
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
        centered
        size={420}
        padding="xl"
        overlayProps={{ backgroundOpacity: 0.75, blur: 10 }}
      >
        <UnlockScreen />
      </Modal>
    </>
  )
}

export default InactivityLock
