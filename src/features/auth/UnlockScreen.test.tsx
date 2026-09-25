import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '@/core/session/store'
import { renderWithProviders } from '@/test/render'
import { startTestSession } from '@/test/session'
import UnlockScreen from './UnlockScreen'

afterEach(() => {
  useSessionStore.setState({ authState: null })
})

describe('UnlockScreen', () => {
  it('shows whose session is locked by name, never by document (ADR-004)', () => {
    const authState = startTestSession()

    renderWithProviders(<UnlockScreen />)

    expect(screen.getByText('Miriam Encarnacion')).toBeInTheDocument()
    expect(screen.queryByText(authState.userName, { exact: false })).not.toBeInTheDocument()
  })

  it('asks only for the password; the user comes from the session', () => {
    startTestSession()

    renderWithProviders(<UnlockScreen />)

    expect(screen.getByLabelText(/^Contraseña/)).toBeInTheDocument()
    expect(screen.queryByLabelText(/Usuario/)).not.toBeInTheDocument()
  })

  it('asks for the temporary password when the session started with one', () => {
    startTestSession({ mustChangePassword: true })

    renderWithProviders(<UnlockScreen />)

    expect(screen.getByLabelText(/Contraseña temporal/)).toBeInTheDocument()
  })

  it('offers a way out through "Cerrar sesión"', () => {
    startTestSession()

    renderWithProviders(<UnlockScreen />)

    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
  })
})
