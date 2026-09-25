import { Outlet } from 'react-router'
import { Modal } from '@mantine/core'
import { useSessionStore } from '@/core/session/store'
import UnlockScreen from '@/features/auth/UnlockScreen'
import { useEffect, useRef } from 'react'

const LIMIT_INACTIVITY_TIME = 15 * 60 * 1000

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
  const isLocked = useSessionStore((state) => state.authState?.isLocked ?? false)

  const lastActivityAt = useRef<number | null>(null)

  useEffect(() => {
    const isTokenExpired = () => {
      const expiresAt = useSessionStore.getState().authState?.expiresAt
      return expiresAt !== undefined && Date.now() >= expiresAt
    }

    const isInactive = () =>
      lastActivityAt.current !== null && Date.now() - lastActivityAt.current > LIMIT_INACTIVITY_TIME

    const checkSession = () => {
      if (isTokenExpired()) {
        endSession()
        return false
      }
      if (isInactive()) {
        lockSession()
        return false
      }
      return true
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

    const intervalId = window.setInterval(checkSession, 20_000)

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, markActivity)
      })
      clearInterval(intervalId)
    }
  }, [lockSession, endSession, isLocked])

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
