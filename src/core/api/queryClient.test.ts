import { describe, expect, it } from 'vitest'
import type { ApiError } from './errors'
import { shouldRetry } from './queryClient'

const asError = (error: ApiError) => error as unknown as Error

const errors: Record<ApiError['kind'], ApiError> = {
  network: { kind: 'network', code: 'ERR_NETWORK', message: '' },
  unknown: { kind: 'unknown', code: 'UNEXPECTED_ERROR', message: '', traceId: '' },
  validation: {
    kind: 'validation',
    code: 'VALIDATION_FAILED',
    message: '',
    traceId: '',
    errors: {},
  },
  business: { kind: 'business', code: 'SY_USER_NOT_FOUND', message: '', traceId: '' },
  rateLimited: { kind: 'rateLimited', code: 'AUTH_TOO_MANY_ATTEMPTS', message: '', traceId: '' },
  forbidden: { kind: 'forbidden', code: 'AUTH_FORBIDDEN', message: '', traceId: '' },
  unauthenticated: {
    kind: 'unauthenticated',
    code: 'AUTH_UNAUTHENTICATED',
    message: '',
    traceId: '',
  },
}

describe('shouldRetry', () => {
  it.each(['network', 'unknown'] as const)('retries a %s error up to three times', (kind) => {
    expect(shouldRetry(0, asError(errors[kind]))).toBe(true)
    expect(shouldRetry(2, asError(errors[kind]))).toBe(true)
    expect(shouldRetry(3, asError(errors[kind]))).toBe(false)
  })

  it.each(['validation', 'business', 'rateLimited', 'forbidden', 'unauthenticated'] as const)(
    'never retries a %s error',
    (kind) => {
      expect(shouldRetry(0, asError(errors[kind]))).toBe(false)
    },
  )

  it('never retries an error that skipped the interceptor', () => {
    expect(shouldRetry(0, new Error('bug'))).toBe(false)
  })
})
