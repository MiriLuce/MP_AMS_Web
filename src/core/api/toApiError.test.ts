import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import { describe, expect, it } from 'vitest'
import { toApiError } from './toApiError'

const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig

function responseError(status: number, data: unknown) {
  return new AxiosError(
    'Request failed',
    'ERR_BAD_RESPONSE',
    config,
    {},
    {
      status,
      statusText: '',
      data,
      headers: {},
      config,
    },
  )
}

describe('toApiError', () => {
  it('maps a 400 to a validation error with its field errors', () => {
    const error = toApiError(
      responseError(400, {
        code: 'VALIDATION_FAILED',
        message: 'Algunos datos no son válidos.',
        traceId: 't-1',
        errors: { email: ['El correo electrónico no es válido.'] },
      }),
    )

    expect(error).toEqual({
      kind: 'validation',
      code: 'VALIDATION_FAILED',
      message: 'Algunos datos no son válidos.',
      traceId: 't-1',
      errors: { email: ['El correo electrónico no es válido.'] },
    })
  })

  it('maps a 401 to unauthenticated and keeps its code', () => {
    const error = toApiError(
      responseError(401, {
        code: 'AUTH_INVALID_CREDENTIALS',
        message: 'Usuario o contraseña incorrectos.',
      }),
    )

    expect(error).toMatchObject({ kind: 'unauthenticated', code: 'AUTH_INVALID_CREDENTIALS' })
  })

  it('maps the API empty-bodied 401 to AUTH_UNAUTHENTICATED', () => {
    expect(toApiError(responseError(401, ''))).toMatchObject({
      kind: 'unauthenticated',
      code: 'AUTH_UNAUTHENTICATED',
    })
  })

  it('maps the API empty-bodied 403 to forbidden', () => {
    expect(toApiError(responseError(403, ''))).toMatchObject({
      kind: 'forbidden',
      code: 'AUTH_FORBIDDEN',
    })
  })

  it.each([404, 409, 422])(
    'maps a %i to a business error with the code from the body',
    (status) => {
      const error = toApiError(
        responseError(status, {
          code: 'SY_USER_NOT_FOUND',
          message: 'El usuario 1 no fue encontrado.',
        }),
      )

      expect(error).toMatchObject({ kind: 'business', code: 'SY_USER_NOT_FOUND' })
    },
  )

  it('maps a 429 to rateLimited with the backend message', () => {
    const error = toApiError(
      responseError(429, {
        code: 'AUTH_TOO_MANY_ATTEMPTS',
        message: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
      }),
    )

    expect(error).toMatchObject({
      kind: 'rateLimited',
      code: 'AUTH_TOO_MANY_ATTEMPTS',
      message: 'Demasiados intentos. Espera un minuto e inténtalo de nuevo.',
    })
  })

  it('treats a text body as unexpected, whatever its status', () => {
    const error = toApiError(responseError(403, '<html>Site Disabled</html>'))

    expect(error).toMatchObject({
      kind: 'unknown',
      message: 'El servidor no está disponible en este momento. Inténtalo más tarde.',
    })
  })

  it('maps a 500 to unknown and keeps the traceId', () => {
    expect(toApiError(responseError(500, { traceId: 't-9' }))).toMatchObject({
      kind: 'unknown',
      code: 'UNEXPECTED_ERROR',
      traceId: 't-9',
    })
  })

  it('maps a request without response to a network error', () => {
    const error = toApiError(new AxiosError('Network Error', 'ERR_NETWORK', config, {}))

    expect(error).toMatchObject({ kind: 'network', code: 'ERR_NETWORK' })
  })

  it('maps a timeout to a network error with its own message', () => {
    const error = toApiError(new AxiosError('timeout', 'ECONNABORTED', config, {}))

    expect(error).toMatchObject({
      kind: 'network',
      code: 'ECONNABORTED',
      message: 'El servidor tardó demasiado en responder. Inténtalo nuevamente.',
    })
  })

  it('maps anything that is not an Axios error to unknown', () => {
    expect(toApiError(new TypeError('boom'))).toMatchObject({ kind: 'unknown', traceId: '' })
  })
})
