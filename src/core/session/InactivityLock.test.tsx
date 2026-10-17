import { act, fireEvent } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { refreshSession } from '@/core/session/refreshSession'
import { useSessionStore } from '@/core/session/store'
import { logout } from '@/features/auth/api'
import { renderWithProviders } from '@/test/render'
import { startTestSession, testLoginResponse } from '@/test/session'
import InactivityLock from './InactivityLock'

vi.mock('@/core/session/refreshSession', () => ({ refreshSession: vi.fn() }))
vi.mock('@/features/auth/api', () => ({ logout: vi.fn(), login: vi.fn() }))

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
  vi.mocked(refreshSession).mockReset().mockResolvedValue(testLoginResponse())
  vi.mocked(logout).mockReset().mockResolvedValue(undefined)
})

afterEach(() => {
  vi.useRealTimers()
  useSessionStore.setState({ authState: null, endReason: null })
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
  it('calls logout once when it locks, however long it stays locked', async () => {
    startTestSession()
    renderLock()

    await act(() => vi.advanceTimersByTimeAsync(40 * MINUTE))

    expect(isLocked()).toBe(true)
    expect(logout).toHaveBeenCalledOnce()
  })
})

describe('InactivityLock renewal', () => {
  it('renews the token when less than 5 minutes remain and there was activity', async () => {
    const original = startTestSession({ expiresIn: 6 * 60 })
    renderLock()

    await act(() => vi.advanceTimersByTimeAsync(1.5 * MINUTE))

    expect(refreshSession).toHaveBeenCalledOnce()
    expect(useSessionStore.getState().authState!.expiresAt).toBeGreaterThan(
      original.expiresAt + 50 * MINUTE,
    )
  })

  it('does not renew an inactive session: it locks it instead', async () => {
    startTestSession({ expiresIn: 25 * 60 })
    renderLock()

    await act(() => vi.advanceTimersByTimeAsync(22 * MINUTE))

    expect(isLocked()).toBe(true)
    expect(refreshSession).not.toHaveBeenCalled()
  })

  it('ends the session as expired when the refresh cookie is rejected', async () => {
    vi.mocked(refreshSession).mockRejectedValue({ kind: 'unauthenticated' })
    startTestSession({ expiresIn: 6 * 60 })
    renderLock()

    await act(() => vi.advanceTimersByTimeAsync(1.5 * MINUTE))

    expect(useSessionStore.getState()).toMatchObject({ authState: null, endReason: 'expired' })
  })

  it('keeps the session and retries on the next tick when the network fails', async () => {
    vi.mocked(refreshSession).mockRejectedValue({ kind: 'network' })
    startTestSession({ expiresIn: 6 * 60 })
    renderLock()

    await act(() => vi.advanceTimersByTimeAsync(2 * MINUTE))

    expect(useSessionStore.getState().authState).not.toBeNull()
    expect(refreshSession).toHaveBeenCalledTimes(3)
  })
})
