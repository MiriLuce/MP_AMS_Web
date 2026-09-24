import { Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = { title: string; managedBy?: string; children: ReactNode }

function AccountBlock({ title, managedBy, children }: Props) {
  return (
    <Paper withBorder shadow="sm" p="xl">
      <Stack gap="md">
        <Stack gap={4}>
          <Title order={3}>{title}</Title>
          {managedBy && (
            <Text size="sm" c="dimmed">
              {managedBy}
            </Text>
          )}
        </Stack>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {children}
        </SimpleGrid>
      </Stack>
    </Paper>
  )
}

export default AccountBlock
