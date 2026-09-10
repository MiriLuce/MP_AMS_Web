import { Title } from '@mantine/core'
import { Route, Routes } from 'react-router'

import AppLayout from '@/core/layout/AppLayout'
import RequireAuth from '@/core/routing/RequireAuth'
import InactivityLock from '@/core/routing/InactivityLock'
import RequirePasswordChanged from '@/core/routing/RequirePasswordChanged'
import RequirePermission from '@/core/routing/RequirePermission'

import NotFoundPage from '@/core/routing/NotFoundPage'
import LoginPage from '@/features/auth/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<InactivityLock />}>
          <Route path="/change-password" element={<Title>Cambiar Contraseña</Title>} />
          <Route element={<RequirePasswordChanged />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Title>Inicio</Title>} />
              <Route element={<RequirePermission permission="EM:AcademicYear.Manage" />}>
                <Route path="/academic-years" element={<Title>Años Escolares</Title>} />
              </Route>
              <Route element={<RequirePermission permission="HR:Employee.View" />}>
                <Route path="/employees" element={<Title>Empleados</Title>} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
