import { Button, Group, PasswordInput, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconLock } from '@tabler/icons-react'

import { useSessionStore } from '@/core/session/store'
import ApiErrorAlert from '@/shared/ApiErrorAlert'
import { useLoginMutation } from './useLoginMutation'
import { BRAND_NAME } from '@/core/brand'

function UnlockScreen() {
  const endSession = useSessionStore((state) => state.endSession)
  const authState = useSessionStore((state) => state.authState)

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '' },
    validate: {
      password: (value) => (value.trim() ? null : 'La contraseña es obligatoria.'),
    },
  })

  const loginMutation = useLoginMutation()

  if (authState === null) return null

  const handleSubmit = (values: { password: string }) => {
    loginMutation.mutate({ userName: authState.userName, password: values.password })
  }

  const isTemporaryPassword = authState.mustChangePassword

  return (
    <Stack gap="lg">
      <Stack gap="xs" align="center">
        <ThemeIcon size={48} radius="xl">
          <IconLock size={26} />
        </ThemeIcon>
        <Title order={3} ta="center">
          Sesión bloqueada
        </Title>
        <Text fw={500} ta="center">
          {authState.displayName}
        </Text>
        <Text c="dimmed" size="sm" ta="center">
          Se bloqueó automáticamente por superar el límite de inactividad.
        </Text>
        {isTemporaryPassword ? (
          <Text c="dimmed" size="sm" ta="center">
            Ingresa tu contraseña temporal para continuar.
          </Text>
        ) : (
          <Text c="dimmed" size="sm" ta="center">
            Ingresa tu contraseña para volver a{' '}
            <Text span inherit c="navy.6" fw={500}>
              {BRAND_NAME}
            </Text>
          </Text>
        )}
      </Stack>

      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {loginMutation.isError && <ApiErrorAlert error={loginMutation.error} />}
          <PasswordInput
            label={isTemporaryPassword ? 'Contraseña temporal' : 'Contraseña'}
            placeholder={
              isTemporaryPassword ? 'Ingresa tu contraseña temporal' : 'Ingresa tu contraseña'
            }
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
        <Button type="button" variant="subtle" size="sm" onClick={() => endSession('logout')}>
          Cerrar sesión
        </Button>
      </Group>
    </Stack>
  )
}

export default UnlockScreen
