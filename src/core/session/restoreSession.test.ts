import { afterEach, describe, expect, it, vi } from 'vitest'
import { testLoginResponse } from '@/test/session'
import { refreshSession } from './refreshSession'
import { restoreSession } from './restoreSession'
import { useSessionStore } from './store'

vi.mock('./refreshSession', () => ({ refreshSession: vi.fn() }))

afterEach(() => {
  vi.mocked(refreshSession).mockReset()
  useSessionStore.setState({ authState: null, isRestoring: true, endReason: null })
})

describe('restoreSession', () => {
  it('starts the session when the refresh cookie is still valid', async () => {
    vi.mocked(refreshSession).mockResolvedValue(testLoginResponse())

    await restoreSession()

    expect(useSessionStore.getState().authState?.displayName).toBe('Miriam Encarnacion')
    expect(useSessionStore.getState().isRestoring).toBe(false)
  })

  it('settles without a session and without an end reason when the refresh fails', async () => {
    vi.mocked(refreshSession).mockRejectedValue({ kind: 'unauthenticated' })

    await restoreSession()

    expect(useSessionStore.getState()).toMatchObject({
      authState: null,
      isRestoring: false,
      endReason: null,
    })
  })
})
