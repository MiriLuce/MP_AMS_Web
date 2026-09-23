import { Title } from '@mantine/core'
import { Route, Routes } from 'react-router'

import AppLayout from '@/core/layout/AppLayout'
import RequireAuth from '@/core/routing/RequireAuth'
import RequireAnonymous from '@/core/routing/RequireAnonymous'
import InactivityLock from '@/core/routing/InactivityLock'
import RequirePasswordChanged from '@/core/routing/RequirePasswordChanged'
import RequirePermission from '@/core/routing/RequirePermission'

import NotFoundPage from '@/core/routing/NotFoundPage'
import LoginPage from '@/features/auth/LoginPage'
import ChangePasswordPage from '@/features/auth/ChangePasswordPage'
import SetPasswordPage from '@/features/auth/SetPasswordPage'
import MyAccountPage from './features/account/MyAccountPage'

function App() {
  return (
    <Routes>
      <Route element={<RequireAnonymous />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route element={<RequireAuth />}>
        <Route element={<InactivityLock />}>
          <Route path="/set-password" element={<SetPasswordPage />} />
          <Route element={<RequirePasswordChanged />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Title>Inicio</Title>} />
              <Route path="/change-password" element={<ChangePasswordPage />} />
              <Route path="/my-account" element={<MyAccountPage />} />
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
