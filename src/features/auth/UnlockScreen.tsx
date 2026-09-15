import { Alert, Button, Group, PasswordInput, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconInfoCircle, IconLock } from '@tabler/icons-react'
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
    onSuccess: (response, variables) => {
      startSession({
        token: response.accessToken,
        userName: response.user.userName,
        mustChangePassword: response.mustChangePassword,
        password: variables.password,
      })
    },
  })

  if (authState === null) return null

  const handleSubmit = (values: { password: string }) => {
    loginMutation.mutate({ userName: authState.userName, password: values.password })
  }

  return (
    <Stack gap="lg">
      <Stack gap="xs" align="center">
        <ThemeIcon size={48} radius="xl">
          <IconLock size={26} />
        </ThemeIcon>
        <Title order={3} ta="center" className={classes.title}>
          Sesión bloqueada
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          Ingresa tu contraseña para volver a{' '}
          <span className={classes.highlight}>Colegios y Academia Max Planck</span>
        </Text>
      </Stack>

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {loginMutation.isError && (
            <Alert variant="light" color="red" title="Error" icon={<IconInfoCircle />}>
              {loginMutation.error.message}
            </Alert>
          )}
          <PasswordInput
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            autoComplete="current-password"
            required
            data-autofocus
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Button fullWidth type="submit" loading={loginMutation.isPending}>
            Desbloquear
          </Button>
        </Stack>
      </form>

      <Group justify="center">
        <Button type="button" variant="subtle" size="sm" onClick={endSession}>
          Cerrar sesión
        </Button>
      </Group>
    </Stack>
  )
}

export default UnlockScreen
