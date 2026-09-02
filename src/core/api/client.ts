import axios, { isCancel } from 'axios'
import { toApiError } from './toApiError'
import { useSessionStore } from '@/core/session/store'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000, // Set a timeout of 10 seconds
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
    console.error(
      '[API Error]:',
      apiError.code,
      apiError.message,
      'traceId' in apiError ? apiError.traceId : '(sin traceId)',
    )

    if (apiError.kind === 'unauthenticated') {
      useSessionStore.getState().logout()
      console.warn('Sesión expirada. Redirigiendo al login...')
    }
    return Promise.reject(apiError)
  },
)
