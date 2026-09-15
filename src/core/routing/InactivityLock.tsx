import { Outlet } from 'react-router'
import { Modal } from '@mantine/core'
import { useSessionStore } from '@/core/session/store'
import UnlockScreen from '@/features/auth/UnlockScreen'
import { useEffect, useRef } from 'react'

const LIMIT_INACTIVITY_TIME = 15 * 60  * 1000

// Deliberadamente NO están `visibilitychange` ni el `focus` de la ventana: volver a la pestaña
// después de veinte minutos afuera es justo cuando el bloqueo tiene que estar puesto.
const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'popstate', // navegación con el botón atrás/adelante del navegador
] as const

function InactivityLock() {
  const lockSession = useSessionStore((state) => state.lockSession)
  const isLocked = useSessionStore((state) => state.authState?.isLocked ?? false)

  const lastActivityAt = useRef<number | null>(null)

  useEffect(() => {
    const markActivity = () => {
      lastActivityAt.current = Date.now()
    }
    markActivity()

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, markActivity, { passive: true })
    })

    const intervalId = window.setInterval(() => {
      if (lastActivityAt.current && Date.now() - lastActivityAt.current > LIMIT_INACTIVITY_TIME) {
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
