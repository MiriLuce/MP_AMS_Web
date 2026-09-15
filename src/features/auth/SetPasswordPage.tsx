import { Button, Container, List, Paper, PasswordInput, Stack, Text, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '@/core/session/store'
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

/**
 * Compuerta obligatoria: se entró con una contraseña temporal (usuario nuevo, o un reset hecho por
 * un administrador, que vuelve a poner `MustChangePassword` en true) y hay que definir una propia.
 *
 * No pide la contraseña actual porque la persona la escribió en el login hace segundos y quedó en
 * `authState.temporaryPassword`. El endpoint sigue recibiéndola: es lo único que prueba que quien
 * cambia la contraseña es la dueña de la cuenta y no alguien que solo consiguió el token.
 *
 * El cambio voluntario es otra pantalla (`ChangePasswordPage`), dentro del AppLayout y con los tres
 * campos, porque ahí la contraseña actual sí hay que escribirla.
 */
function SetPasswordPage() {
  const temporaryPassword = useSessionStore((state) => state.authState?.temporaryPassword ?? null)
  const passwordChanged = useSessionStore((state) => state.passwordChanged)
  const navigate = useNavigate()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { newPassword: '', confirmPassword: '' },
    validate: {
      newPassword: (value) => validateNewPassword(value, temporaryPassword),
      confirmPassword: (value, values) => validatePasswordConfirmation(value, values.newPassword),
    },
  })

  const setPasswordMutation = useMutation<ChangePasswordResponse, ApiError, ChangePasswordRequest>({
    mutationFn: changePassword,
    onSuccess: () => {
      passwordChanged()
      navigate('/', { replace: true })
    },
  })

  const handleSubmit = (values: { newPassword: string }) => {
    // No puede ser null: esta ruta solo se alcanza con `mustChangePassword` en true, y el store
    // guarda la contraseña temporal exactamente mientras esa bandera lo esté. El corte está para
    // acotar el tipo en el punto de uso, no porque se espere el caso.
    if (temporaryPassword === null) return

    setPasswordMutation.mutate({
      currentPassword: temporaryPassword,
      newPassword: values.newPassword,
    })
  }

  return (
    <Container size={460} my={60}>
      <Stack gap="xs" mb="xl">
        <Title order={2} ta="center" className={classes.title}>
          Define tu contraseña
        </Title>
        <Text c="dimmed" size="sm" ta="center">
          Entraste con una contraseña temporal. Elige una propia para continuar.
        </Text>
      </Stack>

      <Paper withBorder shadow="sm" p="xl">
        <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            {setPasswordMutation.isError && <ApiErrorAlert error={setPasswordMutation.error} />}

            <InfoAlert
              title="Requisitos de la contraseña"
              message={
                <List size="sm" spacing={2} mt="xs">
                  {PASSWORD_REQUIREMENTS.map((requirement) => (
                    <List.Item key={requirement}>{requirement}</List.Item>
                  ))}
                </List>
              }
            />

            <PasswordInput
              label="Nueva contraseña"
              placeholder="Ingresa tu nueva contraseña"
              autoComplete="new-password"
              required
              data-autofocus
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

            <Button fullWidth mt="xs" type="submit" loading={setPasswordMutation.isPending}>
              Guardar contraseña
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default SetPasswordPage
