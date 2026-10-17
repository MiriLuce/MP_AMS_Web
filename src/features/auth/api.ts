import { apiClient } from '@/core/api/client'
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
} from './types'

export function login(credentials: LoginRequest) {
  return apiClient
    .post<LoginResponse>('/v1/auth/login', credentials, { withCredentials: true })
    .then((response) => response.data)
}

export function changePassword(credentials: ChangePasswordRequest) {
  return apiClient
    .post<ChangePasswordResponse>('/v1/auth/change-password', credentials, {
      withCredentials: true,
    })
    .then((response) => response.data)
}

export function refresh() {
  return apiClient
    .post<LoginResponse>('/v1/auth/refresh', undefined, { withCredentials: true })
    .then((response) => response.data)
}

export function logout() {
  return apiClient
    .post<void>('/v1/auth/logout', undefined, { withCredentials: true })
    .then(() => undefined)
}
