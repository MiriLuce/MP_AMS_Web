import { apiClient } from '@/core/api/client'
import type { MeResponse } from './types'

export function getMe() {
  return apiClient.get<MeResponse>('/v1/auth/me').then((response) => response.data)
}
