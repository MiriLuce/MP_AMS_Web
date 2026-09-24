import { queryOptions } from '@tanstack/react-query'
import type { ApiError } from '@/core/api/errors'
import type { MeResponse } from './types'
import { getMe } from './api'

export const meQueryOptions = queryOptions<MeResponse, ApiError>({
  queryKey: ['me'],
  queryFn: getMe,
})
