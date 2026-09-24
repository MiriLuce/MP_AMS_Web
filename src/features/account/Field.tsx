import { Stack, Text } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = { label: string; value: ReactNode }

function Field({ label, value }: Props) {
  const isEmpty = value === null || value === undefined || value === ''

  return (
    <Stack gap={2}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      {isEmpty ? <Text>—</Text> : typeof value === 'string' ? <Text>{value}</Text> : value}
    </Stack>
  )
}

export default Field
