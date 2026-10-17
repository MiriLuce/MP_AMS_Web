import { refresh } from '@/features/auth/api'
import type { LoginResponse } from '@/features/auth/types'

let inFlight: Promise<LoginResponse> | null = null

export function refreshSession() {
  inFlight ??= requestRefresh().finally(() => {
    inFlight = null
  })
  return inFlight
}

function requestRefresh() {
  if (!('locks' in navigator)) return refresh()
  return navigator.locks.request('mpams-refresh', () => refresh())
}
