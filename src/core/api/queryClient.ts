import { QueryClient } from '@tanstack/react-query'

const RETRY_TIMES = 3
const STALE_TIME = 5 * 60 * 1000

function shouldRetry(failureCount: number, error: Error): boolean {
  if (!('kind' in error)) return false
  if (error.kind === 'network' || error.kind === 'unknown') return failureCount < RETRY_TIMES
  return false
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      staleTime: STALE_TIME,
    },
  },
})
