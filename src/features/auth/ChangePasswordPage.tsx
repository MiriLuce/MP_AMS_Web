import {
  Alert,
  Button,
  Container,
  List,
  Paper,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCheck } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import ApiErrorAlert from '@/shared/ApiErrorAlert'
import InfoAlert from '@/shared/InfoAlert'
import type { ApiError } from '@/core/api/errors'
import type { ChangePasswordRequest, ChangePasswordResponse } from './types'
import { changePassword } from './api'
import {
  PASSWORD_REQUIREMENTS,
  validateNewPassword,
  validatePasswordConfirmation,
} from './passwordRules'
import classes from './LoginPage.module.css'

function ChangePasswordPage() {
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
    validate: {
      currentPassword: (value) => (value.trim() ? null : 'La contraseña actual es obligatoria.'),
      newPassword: (value, values) => validateNewPassword(value, values.currentPassword),
      confirmPassword: (value, values) => validatePasswordConfirmation(value, values.newPassword),
    },
  })

  const changePasswordMutation = useMutation<
    ChangePasswordResponse,
    ApiError,
    ChangePasswordRequest
  >({
    mutationFn: changePassword,
    onSuccess: () => {
      form.reset()
    },
  })

  const handleSubmit = (values: typeof form.values) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
  }

  return (
    <Container size={460}>
      <Stack gap="xs" mb="xl">
        <Title order={2} className={classes.title}>
          Cambiar contraseña
        </Title>
        <Text c="dimmed" size="sm">
          Necesitas tu contraseña actual para definir una nueva.
        </Text>
      </Stack>

      <Paper withBorder shadow="sm" p="xl">
        <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {changePasswordMutation.isError && (
              <ApiErrorAlert error={changePasswordMutation.error} />
            )}
            {changePasswordMutation.isSuccess && (
              <Alert variant="light" color="green" title="Listo" icon={<IconCheck />}>
                Tu contraseña se cambió correctamente.
              </Alert>
            )}

            <InfoAlert
              title="Requisitos de la nueva contraseña"
              message={
                <List size="sm" spacing={2} mt="xs">
                  {PASSWORD_REQUIREMENTS.map((requirement) => (
                    <List.Item key={requirement}>{requirement}</List.Item>
                  ))}
                </List>
              }
            />

            <PasswordInput
              label="Contraseña actual"
              placeholder="Ingresa tu contraseña actual"
              autoComplete="current-password"
              required
              data-autofocus
              key={form.key('currentPassword')}
              {...form.getInputProps('currentPassword')}
            />
            <PasswordInput
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              autoComplete="new-password"
              required
              key={form.key('newPassword')}
              {...form.getInputProps('newPassword')}
            />
            <PasswordInput
              label="Confirma la nueva contraseña"
              placeholder="Vuelve a ingresar la nueva contraseña"
              autoComplete="new-password"
              required
              key={form.key('confirmPassword')}
              {...form.getInputProps('confirmPassword')}
            />

            <Button fullWidth mt="xs" type="submit" loading={changePasswordMutation.isPending}>
              Cambiar contraseña
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default ChangePasswordPage
