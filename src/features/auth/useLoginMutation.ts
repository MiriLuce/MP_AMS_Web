import { useMutation } from '@tanstack/react-query'
import type { ApiError } from '@/core/api/errors'
import { useSessionStore } from '@/core/session/store'
import { login } from './api'
import type { LoginRequest, LoginResponse } from './types'

export function useLoginMutation(onLoggedIn?: (response: LoginResponse) => void) {
  const startSession = useSessionStore((state) => state.startSession)

  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (response, variables) => {
      startSession(response, variables.password)
      onLoggedIn?.(response)
    },
  })
}
