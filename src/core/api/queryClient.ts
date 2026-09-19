import { QueryClient } from '@tanstack/react-query'

// Una sola instancia, a nivel de módulo y fuera de React. Dos razones, y la segunda es la que
// obligó a sacarla de `main.tsx`:
//   1. La caché tiene que sobrevivir a los re-renders. Creada dentro de un componente se perdería
//      entera en cada uno.
//   2. Hay que alcanzarla desde lugares que no son componentes —`endSession()` en el store y el
//      interceptor del 401 en `client.ts`—, donde `useQueryClient()` no se puede llamar.
export const queryClient = new QueryClient()
