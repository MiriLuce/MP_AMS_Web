import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ApiError } from '@/core/api/errors'
import { renderWithProviders } from '@/test/render'
import { getMe } from './api'
import MyAccountPage from './MyAccountPage'

vi.mock('./api', () => ({ getMe: vi.fn(), updateMe: vi.fn() }))

beforeEach(() => {
  vi.mocked(getMe).mockReset()
})

describe('MyAccountPage', () => {
  it('explains a missing person record instead of showing "usuario no encontrado"', async () => {
    const error: ApiError = {
      kind: 'business',
      code: 'SY_USER_NOT_FOUND',
      message: 'El usuario 7 no fue encontrado.',
      traceId: '',
    }
    vi.mocked(getMe).mockRejectedValue(error)

    renderWithProviders(<MyAccountPage />)

    expect(await screen.findByText(/no tiene una ficha de persona asociada/)).toBeInTheDocument()
    expect(screen.queryByText('El usuario 7 no fue encontrado.')).not.toBeInTheDocument()
  })

  it('shows any other error with the generic alert', async () => {
    const error: ApiError = {
      kind: 'unknown',
      code: 'UNEXPECTED_ERROR',
      message: 'Ocurrió un error inesperado.',
      traceId: '',
    }
    vi.mocked(getMe).mockRejectedValue(error)

    renderWithProviders(<MyAccountPage />)

    expect(await screen.findByText('Ocurrió un error inesperado.')).toBeInTheDocument()
  })
})
