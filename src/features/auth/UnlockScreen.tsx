import { Button, Container, Group, Paper, PasswordInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '@/core/session/store'
import type { ApiError } from '@/core/api/errors'
import type { LoginRequest, LoginResponse } from './types'
import { login } from './api'
import classes from './LoginPage.module.css'

function UnlockScreen() {
  const startSession = useSessionStore((state) => state.startSession)
  const endSession = useSessionStore((state) => state.endSession)
  const authState = useSessionStore((state) => state.authState)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '' },
    validate: {
      password: (value) => (value.trim() ? null : 'La contraseña es obligatoria.'),
    },
  })

  const loginMutation = useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (response) => {
      startSession(response.accessToken, response.user.userName, response.mustChangePassword)
    },
  })

  if (authState === null) return null

  const handleSubmit = (values: { password: string }) => {
    loginMutation.mutate({ userName: authState.userName, password: values.password })
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Desbloquear sesión de{' '}
        <span className={classes.highlight}>Colegios y Academia Max Planck</span>
      </Title>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
          {loginMutation.isError && (
            <Alert variant="light" color="red" title="Error" icon={<IconInfoCircle />} mb="md">
              {loginMutation.error.message}
            </Alert>
          )}
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
          <Group justify="space-between">
            <Button mt="md" radius="md" type="submit" loading={loginMutation.isPending}>
              Desbloquear
            </Button>
            <Button mt="md" radius="md" variant="subtle" onClick={endSession}>
              Cerrar sesión
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  )
}

export default UnlockScreen
