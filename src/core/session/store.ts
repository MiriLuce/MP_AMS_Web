import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

type AuthState = {
  token: string
  expirationTime: number
  userId: string
  roles: Set<string>
  permissions: Set<string>
}
type SessionStore = {
  authState: AuthState | null
  login: (token: string) => void
  logout: () => void
}
type DecodedToken = {
  exp: number
  sub: string
  Role: string[]
  Permission: string[]
}

export const useSessionStore = create<SessionStore>((set) => ({
  authState: null,
  login: (token) => {
    const decodedToken: DecodedToken = jwtDecode(token)
    const authState = {
      token: token,
      expirationTime: decodedToken.exp * 1000,
      userId: decodedToken.sub,
      roles: new Set(decodedToken.Role || []),
      permissions: new Set(decodedToken.Permission || []),
    }
    set({ authState })
  },
  logout: () => {
    set({ authState: null })
  },
}))
