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
  'popstate', // navegación con el botón atrás/adelante del navegador
  'visibilitychange',
  'focus',
] as const

function InactivityLock() {
  const lockSession = useSessionStore((state) => state.lockSession)
  const isLocked = useSessionStore((state) => state.authState?.isLocked ?? false)

  const lastActivityAt = useRef<number | null>(null)

  useEffect(() => {
    const hasExpired = () =>
      lastActivityAt.current !== null && Date.now() - lastActivityAt.current > LIMIT_INACTIVITY_TIME

    const markActivity = () => {
      if (hasExpired()) {
        lockSession()
        return
      }
      lastActivityAt.current = Date.now()
    }
    lastActivityAt.current = Date.now()

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, markActivity, { passive: true })
    })

    const intervalId = window.setInterval(() => {
      if (hasExpired()) {
        lockSession()
      }
    }, 20_000)

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, markActivity)
      })
      clearInterval(intervalId)
    }
  }, [lockSession, isLocked])

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
