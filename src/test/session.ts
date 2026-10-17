import { useSessionStore } from '@/core/session/store'
import type { LoginResponse } from '@/features/auth/types'

const base64Url = (value: object) =>
  btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export function testToken(claims: object) {
  return `${base64Url({ alg: 'HS256', typ: 'JWT' })}.${base64Url(claims)}.signature`
}

type Options = {
  claims?: object
  expiresIn?: number
  mustChangePassword?: boolean
}

export function testLoginResponse({
  claims = {},
  expiresIn = 60 * 60,
  mustChangePassword = false,
}: Options = {}): LoginResponse {
  return {
    accessToken: testToken({ sub: '7', ...claims }),
    tokenType: 'Bearer',
    expiresIn,
    mustChangePassword,
    user: {
      userId: 7,
      userName: '72782793',
      typeDocumentIdentity: 'DNI',
      documentIdentity: '72782793',
      firstName: 'Miriam',
      middleName: null,
      fatherLastName: 'Encarnacion',
      motherLastName: null,
      email: 'miriam@example.com',
      roles: ['Admin'],
    },
  }
}

export function startTestSession(options: Options = {}) {
  useSessionStore.getState().startSession(testLoginResponse(options), 'Temporal123!')
  return useSessionStore.getState().authState!
}
