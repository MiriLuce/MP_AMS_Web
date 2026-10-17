import { act, fireEvent } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSessionStore } from '@/core/session/store'
import { renderWithProviders } from '@/test/render'
import { startTestSession } from '@/test/session'
import InactivityLock from './InactivityLock'

const MINUTE = 60_000

function renderLock() {
  renderWithProviders(
    <Routes>
      <Route element={<InactivityLock />}>
        <Route path="/" element={<p>Contenido</p>} />
      </Route>
    </Routes>,
  )
}

const isLocked = () => useSessionStore.getState().authState?.isLocked

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-24T12:00:00-05:00'))
})

afterEach(() => {
  vi.useRealTimers()
  useSessionStore.setState({ authState: null })
})

describe('InactivityLock', () => {
  it('locks the session after 15 minutes without activity', () => {
    startTestSession()
    renderLock()

    act(() => vi.advanceTimersByTime(16 * MINUTE))

    expect(isLocked()).toBe(true)
  })

  it('does not lock while there is activity', () => {
    startTestSession()
    renderLock()

    act(() => vi.advanceTimersByTime(10 * MINUTE))
    fireEvent.mouseMove(window)
    act(() => vi.advanceTimersByTime(10 * MINUTE))

    expect(isLocked()).toBe(false)
  })

  it('locks on the first event after the limit instead of resetting the clock', () => {
    startTestSession()
    renderLock()

    act(() => vi.setSystemTime(Date.now() + 20 * MINUTE))
    fireEvent.focus(window)

    expect(isLocked()).toBe(true)
  })

  it('ends the session when the token expires, even if it is locked', () => {
    startTestSession({ expiresIn: 5 * 60 })
    useSessionStore.getState().lockSession()
    renderLock()

    act(() => vi.advanceTimersByTime(6 * MINUTE))

    expect(useSessionStore.getState().authState).toBeNull()
  })
})
