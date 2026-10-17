import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { queryClient } from '@/core/api/queryClient'
import { testLoginResponse, testToken } from '@/test/session'
import { useSessionStore } from './store'

const NOW = new Date('2026-10-16T12:00:00-05:00').getTime()

function start(claims: object, mustChangePassword = false) {
  useSessionStore
    .getState()
    .startSession(testLoginResponse({ claims, mustChangePassword }), 'Temporal123!')
  return useSessionStore.getState().authState!
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(NOW)
})

afterEach(() => {
  vi.useRealTimers()
  useSessionStore.setState({ authState: null, isRestoring: true, endReason: null })
})

describe('startSession', () => {
  it('reads the subject from the token', () => {
    expect(start({}).userId).toBe('7')
  })

  it('computes expiry from expiresIn with the local clock, not from the token exp', () => {
    const response = testLoginResponse({ expiresIn: 15 * 60 })
    response.accessToken = testToken({ sub: '7', exp: (NOW - 10 * 60_000) / 1000 })

    useSessionStore.getState().startSession(response)

    expect(useSessionStore.getState().authState?.expiresAt).toBe(NOW + 15 * 60_000)
  })

  it('builds the display name and avatar from the login response', () => {
    const authState = start({})

    expect(authState.displayName).toBe('Miriam Encarnacion')
    expect(authState.avatarName).toBe('ME')
  })

  it('accepts a single permission claim or an array', () => {
    expect(start({ permission: 'PM:Person.View' }).permissions).toEqual(new Set(['PM:Person.View']))
    expect(start({ permission: ['A', 'B'] }).permissions).toEqual(new Set(['A', 'B']))
  })

  it('uses empty sets when the token has no roles or permissions', () => {
    const authState = start({})

    expect(authState.permissions.size).toBe(0)
    expect(authState.roles.size).toBe(0)
  })

  it('keeps the temporary password only while it must be changed', () => {
    expect(start({}, true).temporaryPassword).toBe('Temporal123!')
    expect(start({}, false).temporaryPassword).toBeNull()
  })

  it('starts from a refresh response, which carries no password', () => {
    useSessionStore.getState().startSession(testLoginResponse())

    expect(useSessionStore.getState()).toMatchObject({
      authState: { temporaryPassword: null },
      isRestoring: false,
    })
  })

  it('forgets why the previous session ended', () => {
    useSessionStore.getState().endSession('expired')

    start({})

    expect(useSessionStore.getState().endReason).toBeNull()
  })
})

describe('session transitions', () => {
  it('sessionRenewed replaces token, expiry and permissions, and keeps the lock', () => {
    start({ permission: 'A' })
    useSessionStore.getState().lockSession()
    vi.setSystemTime(NOW + 10 * 60_000)

    useSessionStore.getState().sessionRenewed(testLoginResponse({ claims: { permission: 'B' } }))

    const authState = useSessionStore.getState().authState!
    expect(authState.expiresAt).toBe(NOW + 10 * 60_000 + 60 * 60_000)
    expect(authState.permissions).toEqual(new Set(['B']))
    expect(authState.isLocked).toBe(true)
  })

  it('lockSession locks, and a second call leaves the state untouched', () => {
    start({})
    useSessionStore.getState().lockSession()
    const locked = useSessionStore.getState().authState

    useSessionStore.getState().lockSession()

    expect(locked?.isLocked).toBe(true)
    expect(useSessionStore.getState().authState).toBe(locked)
  })

  it('passwordChanged clears the flag and forgets the temporary password', () => {
    start({}, true)

    useSessionStore.getState().passwordChanged()

    expect(useSessionStore.getState().authState).toMatchObject({
      mustChangePassword: false,
      temporaryPassword: null,
    })
  })

  it('finishRestoring ends the restoring state without a session', () => {
    useSessionStore.getState().finishRestoring()

    expect(useSessionStore.getState()).toMatchObject({ authState: null, isRestoring: false })
  })

  it('endSession clears the session and the query cache, and records why', () => {
    const clear = vi.spyOn(queryClient, 'clear')
    start({})

    useSessionStore.getState().endSession('expired')

    expect(useSessionStore.getState()).toMatchObject({ authState: null, endReason: 'expired' })
    expect(clear).toHaveBeenCalledOnce()
    clear.mockRestore()
  })
})
