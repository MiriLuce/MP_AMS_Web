import { isAxiosError } from 'axios'
import type { ApiError } from './errors'

type ProblemDetailsBody = {
  code?: string
  message?: string
  traceId?: string
  errors?: Record<string, string[]>
}

export function toApiError(error: unknown): ApiError {
  if (!isAxiosError<ProblemDetailsBody>(error)) {
    return {
      kind: 'unknown',
      code: 'UNEXPECTED_ERROR',
      message: 'Ocurrió un error inesperado.',
      traceId: '',
    }
  }

  if (error.response === undefined) {
    const code =
      error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' ? error.code : 'ERR_NETWORK'
    return {
      kind: 'network',
      code,
      message:
        code === 'ERR_NETWORK'
          ? 'No pudimos conectarnos con el servidor. Revisa tu conexión.'
          : 'El servidor tardó demasiado en responder. Inténtalo nuevamente.',
    }
  }

  const body: ProblemDetailsBody = error.response.data ?? {}
  const traceId = body.traceId ?? ''

  switch (error.response.status) {
    case 400:
      return {
        kind: 'validation',
        code: 'VALIDATION_FAILED',
        message: body.message ?? 'Los datos enviados no son válidos.',
        traceId,
        errors: body.errors ?? {},
      }

    case 401:
      return {
        kind: 'unauthenticated',
        code: 'AUTH_UNAUTHENTICATED',
        message: body.message ?? 'Tu sesión no es válida o expiró. Vuelve a iniciar sesión.',
        traceId,
      }

    case 403:
      return {
        kind: 'forbidden',
        code: 'AUTH_FORBIDDEN',
        message: body.message ?? 'No tienes permiso para realizar esta acción.',
        traceId,
      }

    case 404:
    case 409:
    case 422:
      return {
        kind: 'business',
        code: body.code ?? 'UNKNOWN_BUSINESS_ERROR',
        message: body.message ?? 'No se pudo completar la operación.',
        traceId,
      }

    default:
      return {
        kind: 'unknown',
        code: 'UNEXPECTED_ERROR',
        message: body.message ?? 'Ocurrió un error inesperado.',
        traceId,
      }
  }
}
