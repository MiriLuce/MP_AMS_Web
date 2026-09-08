import { Title } from '@mantine/core'
import { Route, Routes } from 'react-router'
import AppLayout from '@/core/layout/AppLayout'
import NotFoundPage from '@/core/routing/NotFoundPage'
import { LoginPage } from '@/features/auth/LoginPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Title>Inicio</Title>} />
        <Route path="/change-password" element={<Title>Cambiar Contraseña</Title>} />
        <Route path="/academic-years" element={<Title>Años Escolares</Title>} />
        <Route path="/employees" element={<Title>Empleados</Title>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
