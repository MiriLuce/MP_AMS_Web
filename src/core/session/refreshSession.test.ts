import { beforeEach, describe, expect, it, vi } from 'vitest'
import { refresh } from '@/features/auth/api'
import { testLoginResponse } from '@/test/session'
import { refreshSession } from './refreshSession'

vi.mock('@/features/auth/api', () => ({ refresh: vi.fn() }))

const response = testLoginResponse()

beforeEach(() => {
  vi.mocked(refresh).mockReset()
})

describe('refreshSession', () => {
  it('shares a single request between concurrent calls', async () => {
    vi.mocked(refresh).mockResolvedValue(response)

    const first = refreshSession()
    const second = refreshSession()

    expect(first).toBe(second)
    await expect(first).resolves.toBe(response)
    expect(refresh).toHaveBeenCalledOnce()
  })

  it('makes a new request once the previous one has failed', async () => {
    vi.mocked(refresh).mockRejectedValueOnce(new Error('offline')).mockResolvedValue(response)

    await expect(refreshSession()).rejects.toThrow('offline')
    await expect(refreshSession()).resolves.toBe(response)
    expect(refresh).toHaveBeenCalledTimes(2)
  })
})
