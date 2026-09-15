import { Alert, Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import type { ApiError } from '@/core/api/errors'

type Props = { error: ApiError }

function ApiErrorAlert({ error }: Props) {
  // El traceId solo se muestra en un fallo inesperado: es lo único que le sirve a soporte, y
  // ponerlo en un evento normal (contraseña incorrecta) disfraza de incidente algo que no lo es.
  // `kind === 'unknown'` además acota el union: NetworkError no tiene traceId, porque nunca llegó
  // al servidor. Y toApiError deja el campo en '' cuando el cuerpo no lo trae.
  const showTraceId = error.kind === 'unknown' && error.traceId !== ''

  return (
    <Alert variant="light" color="red" title="Error" icon={<IconAlertTriangle />}>
      {error.message}
      {showTraceId && (
        <Text size="xs" c="dimmed" mt="xs">
          Código de seguimiento: {error.traceId}
        </Text>
      )}
    </Alert>
  )
}

export default ApiErrorAlert
