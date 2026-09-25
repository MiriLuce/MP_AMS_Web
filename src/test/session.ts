import { useSessionStore } from '@/core/session/store'

const base64Url = (value: object) =>
  btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

export function testToken(claims: object) {
  return `${base64Url({ alg: 'HS256', typ: 'JWT' })}.${base64Url(claims)}.signature`
}

type Options = {
  claims?: object
  expiresAt?: number
  mustChangePassword?: boolean
}

export function startTestSession({
  claims = {},
  expiresAt = 2_000_000_000_000,
  mustChangePassword = false,
}: Options = {}) {
  useSessionStore.getState().startSession({
    token: testToken({ exp: Math.floor(expiresAt / 1000), sub: '7', ...claims }),
    userName: '72782793',
    firstName: 'Miriam',
    fatherLastName: 'Encarnacion',
    mustChangePassword,
    password: 'Temporal123!',
  })
  return useSessionStore.getState().authState!
}
