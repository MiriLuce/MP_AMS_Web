import { apiClient } from '@/core/api/client'
import type { LoginRequest, LoginResponse } from './types'

export function login(credentials: LoginRequest) {
  return apiClient
    .post<LoginResponse>('/v1/auth/login', credentials)
    .then((response) => response.data)
}
