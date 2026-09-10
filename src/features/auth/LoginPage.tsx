import { Button, Container, Paper, PasswordInput, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router'
import { Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '@/core/session/store'
import type { ApiError } from '@/core/api/errors'
import type { LoginRequest, LoginResponse } from './types'
import { login } from './api'
import classes from './LoginPage.module.css'

function LoginPage() {
  const startSession = useSessionStore((state) => state.startSession)
  const navigate = useNavigate()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { userName: '', password: '' },
    validate: {
      userName: (value: string) => {
        if (!value.trim()) {
          return 'El nombre de usuario es obligatorio.'
        }
        if (value.length > 20) {
          return 'El nombre de usuario no puede exceder 20 caracteres.'
        }
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          return 'El nombre de usuario solo puede contener letras y dígitos.'
        }
        return null
      },
      password: (value) => (value.trim() ? null : 'La contraseña es obligatoria.'),
    },
  })

  const loginMutation = useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (response) => {
      startSession(response.accessToken, response.mustChangePassword)
      if (response.mustChangePassword) {
        navigate('/change-password', { replace: true })
        return
      }
      navigate('/', { replace: true })
    },
  })

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Bienvenido a <span className={classes.highlight}>Colegios y Academia Max Planck</span>
      </Title>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form noValidate onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
          {loginMutation.isError && (
            <Alert variant="light" color="red" title="Error" icon={<IconInfoCircle />} mb="md">
              {loginMutation.error.message}
            </Alert>
          )}
          <TextInput
            radius="md"
            label="Usuario"
            placeholder="Ingresa tu usuario"
            autoComplete="username"
            required
            key={form.key('userName')}
            {...form.getInputProps('userName')}
          />
          <PasswordInput
            radius="md"
            mt="md"
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" radius="md" type="submit" loading={loginMutation.isPending}>
            Iniciar sesión
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

export default LoginPage
