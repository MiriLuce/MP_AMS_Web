import axios, { isCancel } from 'axios'
import { toApiError } from './toApiError'
import { useSessionStore } from '@/core/session/store'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 5 * 1000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useSessionStore.getState().authState?.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isCancel(error)) {
      return Promise.reject(error)
    }
    const apiError = toApiError(error)
    if (import.meta.env.DEV && (apiError.kind === 'unknown' || apiError.kind === 'network')) {
      console.error(
        '[API]',
        apiError.code,
        apiError.message,
        'traceId' in apiError ? apiError.traceId : '',
      )
    }

    if (apiError.kind === 'unauthenticated' && useSessionStore.getState().authState !== null) {
      useSessionStore.getState().endSession()
    }
    return Promise.reject(apiError)
  },
)
