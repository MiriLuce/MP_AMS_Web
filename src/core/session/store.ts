import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'

type AuthState = {
  token: string
  expiresAt: number
  userId: string
  userName: string
  roles: Set<string> | undefined
  permissions: Set<string> | undefined
  mustChangePassword: boolean
  // La contraseña temporal con la que se acaba de entrar, guardada solo mientras
  // `mustChangePassword` la exija. SetPasswordPage la manda como `currentPassword`, así la persona
  // no retipea lo que escribió hace cinco segundos y el endpoint sigue exigiendo la contraseña
  // anterior — que es lo único que distingue a la dueña de la cuenta de quien solo robó el token.
  // La limpia `passwordChanged()`; `endSession()` se la lleva puesta. Nunca sale de la pestaña.
  temporaryPassword: string | null
  isLocked: boolean
}

// Objeto y no cuatro posicionales: el tercer argumento es un booleano suelto, y en el call site
// `startSession(t, u, false, p)` no se puede leer sin abrir esta definición.
type StartSessionInput = {
  token: string
  userName: string
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
  startSession: ({ token, userName, mustChangePassword, password }) => {
    const decodedToken: DecodedToken = jwtDecode(token)
    const authState = {
      token: token,
      expiresAt: decodedToken.exp * 1000,
      userId: decodedToken.sub,
      userName: userName,
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
