import { Alert, Text } from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons-react'
import type { ApiError } from '@/core/api/errors'

type Props = { error: ApiError }

function ApiErrorAlert({ error }: Props) {
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
