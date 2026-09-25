import { screen } from '@testing-library/react'
import { Route, Routes } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import { useSessionStore } from '@/core/session/store'
import { renderWithProviders } from '@/test/render'
import { startTestSession } from '@/test/session'
import RequirePermission from './RequirePermission'

function renderGuardedRoute() {
  renderWithProviders(
    <Routes>
      <Route path="/login" element={<p>Pantalla de login</p>} />
      <Route element={<RequirePermission permission="HR:Employee.View" />}>
        <Route path="/" element={<p>Contenido protegido</p>} />
      </Route>
    </Routes>,
  )
}

afterEach(() => {
  useSessionStore.setState({ authState: null })
})

describe('RequirePermission', () => {
  it('renders the page when the token carries the permission', () => {
    startTestSession({ claims: { permission: ['HR:Employee.View'] } })

    renderGuardedRoute()

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument()
  })

  it('renders the 403 in place, without redirecting, when the permission is missing', () => {
    startTestSession({ claims: { permission: ['EM:AcademicYear.Manage'] } })

    renderGuardedRoute()

    expect(screen.getByText(/Acceso denegado/)).toBeInTheDocument()
    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument()
  })

  it('redirects to the login without a session', () => {
    renderGuardedRoute()

    expect(screen.getByText('Pantalla de login')).toBeInTheDocument()
  })
})
