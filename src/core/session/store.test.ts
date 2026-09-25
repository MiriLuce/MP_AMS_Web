import { afterEach, describe, expect, it, vi } from 'vitest'
import { queryClient } from '@/core/api/queryClient'
import { testToken } from '@/test/session'
import { useSessionStore } from './store'

function start(claims: object, mustChangePassword = false) {
  useSessionStore.getState().startSession({
    token: testToken({ exp: 2_000_000_000, sub: '7', ...claims }),
    userName: '72782793',
    firstName: 'Miriam',
    fatherLastName: 'Encarnacion',
    mustChangePassword,
    password: 'Temporal123!',
  })
  return useSessionStore.getState().authState!
}

afterEach(() => {
  useSessionStore.setState({ authState: null })
})

describe('startSession', () => {
  it('reads expiry and subject from the token', () => {
    const authState = start({})

    expect(authState.expiresAt).toBe(2_000_000_000_000)
    expect(authState.userId).toBe('7')
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
})

describe('session transitions', () => {
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

  it('endSession clears the session and the query cache', () => {
    const clear = vi.spyOn(queryClient, 'clear')
    start({})

    useSessionStore.getState().endSession()

    expect(useSessionStore.getState().authState).toBeNull()
    expect(clear).toHaveBeenCalledOnce()
    clear.mockRestore()
  })
})
