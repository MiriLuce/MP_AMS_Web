import { SimpleGrid } from '@mantine/core'
import type { ReactNode } from 'react'

function FieldGrid({ children }: { children: ReactNode }) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
      {children}
    </SimpleGrid>
  )
}

export default FieldGrid
