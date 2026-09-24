import { Paper, SimpleGrid, Stack, Title } from '@mantine/core'
import type { ReactNode } from 'react'

type Props = { title: string; children: ReactNode }

function AccountBlock({ title, children }: Props) {
  return (
    <Paper withBorder shadow="sm" p="xl">
      <Stack gap="md">
        <Title order={3}>{title}</Title>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
          {children}
        </SimpleGrid>
      </Stack>
    </Paper>
  )
}

export default AccountBlock
