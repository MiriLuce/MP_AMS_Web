import { apiClient } from '@/core/api/client'
import type { MeResponse } from './types'

// No recibe ningún identificador, y es deliberado: el backend resuelve el sujeto desde
// el claim `sub` del token. Un parámetro acá sería una forma de pedir la ficha de otro.
export function getMe() {
  return apiClient.get<MeResponse>('/v1/auth/me').then((response) => response.data)
}
