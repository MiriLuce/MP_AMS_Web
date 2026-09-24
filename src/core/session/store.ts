import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

import { queryClient } from '@/core/api/queryClient'

type AuthState = {
  token: string
  expiresAt: number
  userId: string
  userName: string
  displayName: string
  avatarName: string
  roles: Set<string> | undefined
  permissions: Set<string> | undefined
  mustChangePassword: boolean
  temporaryPassword: string | null
  isLocked: boolean
}

type StartSessionInput = {
  token: string
  userName: string
  firstName: string
  fatherLastName: string
  mustChangePassword: boolean
  password: string
}

type SessionStore = {
  authState: AuthState | null
  startSession: (input: StartSessionInput) => void
  endSession: () => void
  lockSession: () => void
  passwordChanged: () => void
}

type DecodedToken = {
  exp: number
  sub: string
  role: string | string[]
  permission: string | string[]
}

export const useSessionStore = create<SessionStore>((set) => ({
  authState: null,
  startSession: ({ token, userName, firstName, fatherLastName, mustChangePassword, password }) => {
    const decodedToken: DecodedToken = jwtDecode(token)
    const authState = {
      token: token,
      expiresAt: decodedToken.exp * 1000,
      userId: decodedToken.sub,
      userName: userName,
      displayName: `${firstName} ${fatherLastName}`,
      avatarName: `${firstName[0]}${fatherLastName[0]}`,
      roles:
        decodedToken.role === undefined
          ? undefined
          : new Set(Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role]),
      permissions:
        decodedToken.permission === undefined
          ? undefined
          : new Set(
              Array.isArray(decodedToken.permission)
                ? decodedToken.permission
                : [decodedToken.permission],
            ),
      mustChangePassword: mustChangePassword,
      temporaryPassword: mustChangePassword ? password : null,
      isLocked: false,
    }
    set({ authState })
  },
  endSession: () => {
    set({ authState: null })
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
