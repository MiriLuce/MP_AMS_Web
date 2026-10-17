import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

import { queryClient } from '@/core/api/queryClient'
import type { LoginResponse } from '@/features/auth/types'

type AuthState = {
  token: string
  expiresAt: number
  userId: string
  userName: string
  displayName: string
  avatarName: string
  roles: Set<string>
  permissions: Set<string>
  mustChangePassword: boolean
  temporaryPassword: string | null
  isLocked: boolean
}

type EndReason = 'logout' | 'expired'

type SessionStore = {
  authState: AuthState | null
  isRestoring: boolean
  endReason: EndReason | null
  startSession: (response: LoginResponse, password?: string) => void
  sessionRenewed: (response: LoginResponse) => void
  finishRestoring: () => void
  endSession: (reason: EndReason) => void
  lockSession: () => void
  passwordChanged: () => void
}

type DecodedToken = {
  sub: string
  role?: string | string[]
  permission?: string | string[]
}

const toClaimSet = (claim: string | string[] | undefined) =>
  new Set(claim === undefined ? [] : Array.isArray(claim) ? claim : [claim])

const readToken = (response: LoginResponse) => {
  const decodedToken: DecodedToken = jwtDecode(response.accessToken)
  return {
    token: response.accessToken,
    expiresAt: Date.now() + response.expiresIn * 1000,
    userId: decodedToken.sub,
    roles: toClaimSet(decodedToken.role),
    permissions: toClaimSet(decodedToken.permission),
  }
}

export const useSessionStore = create<SessionStore>((set) => ({
  authState: null,
  isRestoring: true,
  endReason: null,
  startSession: (response, password) => {
    const { user, mustChangePassword } = response
    const authState = {
      ...readToken(response),
      userName: user.userName,
      displayName: `${user.firstName} ${user.fatherLastName}`,
      avatarName: `${user.firstName[0]}${user.fatherLastName[0]}`,
      mustChangePassword: mustChangePassword,
      temporaryPassword: mustChangePassword ? (password ?? null) : null,
      isLocked: false,
    }
    set({ authState, isRestoring: false, endReason: null })
  },
  sessionRenewed: (response) => {
    set((state) => ({
      authState: state.authState ? { ...state.authState, ...readToken(response) } : null,
    }))
  },
  finishRestoring: () => {
    set({ isRestoring: false })
  },
  endSession: (reason) => {
    set({ authState: null, endReason: reason })
    queryClient.clear()
  },
  lockSession: () => {
    set((state) => ({
      authState: state.authState
        ? state.authState.isLocked
          ? state.authState
          : { ...state.authState, isLocked: true }
        : null,
    }))
  },
  passwordChanged: () => {
    set((state) => ({
      authState: state.authState
        ? state.authState.mustChangePassword
          ? { ...state.authState, mustChangePassword: false, temporaryPassword: null }
          : state.authState
        : null,
    }))
  },
}))
