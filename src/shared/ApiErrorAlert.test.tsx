import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import ApiErrorAlert from './ApiErrorAlert'

describe('ApiErrorAlert', () => {
  it('shows the traceId for an unexpected error, which is what support needs', () => {
    renderWithProviders(
      <ApiErrorAlert
        error={{ kind: 'unknown', code: 'UNEXPECTED_ERROR', message: 'Falló.', traceId: 't-42' }}
      />,
    )

    expect(screen.getByText(/t-42/)).toBeInTheDocument()
  })

  it('hides the traceId for an ordinary business error', () => {
    renderWithProviders(
      <ApiErrorAlert
        error={{ kind: 'business', code: 'X', message: 'No se pudo.', traceId: 't-42' }}
      />,
    )

    expect(screen.getByText('No se pudo.')).toBeInTheDocument()
    expect(screen.queryByText(/t-42/)).not.toBeInTheDocument()
  })
})
