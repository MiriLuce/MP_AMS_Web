import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

type AuthState = {
  token: string
  expirationTime: number
  userId: string
  roles: Set<string> | undefined
  permissions: Set<string> | undefined
}
type SessionStore = {
  authState: AuthState | null
  startSession: (token: string) => void
  endSession: () => void
}

// La forma del JWT, no la de LoginResponse. Los nombres son los del token tal cual: los claims son
// sensibles a mayúsculas, y escribir mal uno da `undefined` sin ningún error
//
// `sub` es string aunque `LoginResponse.user.userId` sea number: mismo dato, dos serializaciones.
// RFC 7519 exige que `sub` sea un string, así que no va a cambiar.
//
// No hay claim con el nombre de usuario, a propósito: sería el documento de identidad (ADR-004) y un
// JWT viaja sin cifrar en cada request. Para mostrar el nombre está `LoginResponse.user`.
type DecodedToken = {
  exp: number
  sub: string
  role: string | string[]
  permission: string | string[]
}

export const useSessionStore = create<SessionStore>((set) => ({
  authState: null,
  startSession: (token) => {
    const decodedToken: DecodedToken = jwtDecode(token)
    const authState = {
      token: token,
      expirationTime: decodedToken.exp * 1000,
      userId: decodedToken.sub,
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
    }
    set({ authState })
  },
  endSession: () => {
    set({ authState: null })
  },
}))
