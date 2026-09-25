import {
  Alert,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  SimpleGrid,
  Stack,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconCheck } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'

import ApiErrorAlert from '@/shared/ApiErrorAlert'
import type { ApiError } from '@/core/api/errors'
import type { ChangePasswordRequest, ChangePasswordResponse } from './types'
import { changePassword } from './api'
import PasswordRequirements from './PasswordRequirements'
import { validateNewPassword, validatePasswordConfirmation } from './passwordRules'
import PageHeader from '@/shared/PageHeader'

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
    <Container size="md" py="xl">
      <PageHeader title="Cambiar contraseña" />

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

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
              <Stack gap="md">
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
              </Stack>

              <PasswordRequirements title="Requisitos de la nueva contraseña" />
            </SimpleGrid>

            <Group justify="flex-end">
              <Button type="submit" loading={changePasswordMutation.isPending}>
                Cambiar contraseña
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default ChangePasswordPage
