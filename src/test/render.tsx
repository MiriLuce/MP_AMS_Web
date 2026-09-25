import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router'
import { theme } from '@/core/theme'

type Options = { route?: string }

export function renderWithProviders(ui: ReactNode, { route = '/' }: Options = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  return render(
    <MemoryRouter initialEntries={[route]}>
      <MantineProvider theme={theme}>
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
      </MantineProvider>
    </MemoryRouter>,
  )
}
