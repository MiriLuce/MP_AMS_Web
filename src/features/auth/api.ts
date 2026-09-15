import { apiClient } from '@/core/api/client'
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
} from './types'

export function login(credentials: LoginRequest) {
  return apiClient
    .post<LoginResponse>('/v1/auth/login', credentials)
    .then((response) => response.data)
}

export function changePassword(credentials: ChangePasswordRequest) {
  return apiClient
    .post<ChangePasswordResponse>('/v1/auth/change-password', credentials)
    .then((response) => response.data)
}
