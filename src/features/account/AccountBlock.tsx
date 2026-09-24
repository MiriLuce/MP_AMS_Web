import { Group, Paper, Stack, Title } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = { title: string; action?: ReactNode; children: ReactNode }

function AccountBlock({ title, action, children }: Props) {
  return (
    <Paper withBorder shadow="sm" p="xl">
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <Title order={3}>{title}</Title>
          {action}
        </Group>
        {children}
      </Stack>
    </Paper>
  )
}

export default AccountBlock
