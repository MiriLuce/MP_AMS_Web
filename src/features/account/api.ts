import { apiClient } from '@/core/api/client'
import type { MeResponse, UpdateMyContactInfoRequest } from './types'

export function getMe() {
  return apiClient.get<MeResponse>('/v1/auth/me').then((response) => response.data)
}

export function updateMe(request: UpdateMyContactInfoRequest) {
  return apiClient.put<MeResponse>('/v1/auth/me', request).then((response) => response.data)
}
