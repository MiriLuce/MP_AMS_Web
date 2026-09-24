import {
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Flex,
  Box,
  Group,
  Image,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'

import { useSessionStore } from '@/core/session/store'
import ApiErrorAlert from '@/shared/ApiErrorAlert'
import type { ApiError } from '@/core/api/errors'
import type { LoginRequest, LoginResponse } from './types'
import { login } from './api'
import classes from './LoginPage.module.css'
import logoElAlba from '@/assets/logos/logoElAlba.svg'
import logoMaxPlanck from '@/assets/logos/logoMaxPlanck.svg'
import logoNuevoHorizonte from '@/assets/logos/logoNuevoHorizonte.svg'

const USER_NAME_MAX_LENGTH = 20

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
        if (value.length > USER_NAME_MAX_LENGTH) {
          return `El nombre de usuario no puede exceder ${USER_NAME_MAX_LENGTH} caracteres.`
        }
        if (!/^[a-zA-Z0-9]+$/.test(value)) {
          return 'El nombre de usuario solo puede contener letras y dígitos, sin espacios, tildes ni símbolos.'
        }
        return null
      },
      password: (value) => (value.trim() ? null : 'La contraseña es obligatoria.'),
    },
  })

  const loginMutation = useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: login,
    onSuccess: (response, variables) => {
      startSession({
        token: response.accessToken,
        userName: response.user.userName,
        firstName: response.user.firstName,
        fatherLastName: response.user.fatherLastName,
        mustChangePassword: response.mustChangePassword,
        password: variables.password,
      })
      if (response.mustChangePassword) {
        navigate('/set-password', { replace: true })
        return
      }
      navigate('/', { replace: true })
    },
  })

  return (
    <Flex mih="100dvh">
      <Box className={classes.panel} visibleFrom="md" w="60%">
        <Text fw={700} fz="2.25rem" lh={1.2}>
          Bienvenido a Colegios <br /> y Academia Max Planck
        </Text>
        <Stack gap="lg" align="center" mt="md">
          <Group justify="center" align="center">
            <Image
              src={logoElAlba}
              alt="El Alba"
              h={{ base: 110, lg: 165, xl: 220 }}
              w="auto"
              fit="contain"
            />
            <Image
              src={logoNuevoHorizonte}
              alt="Nuevo Horizonte"
              h={{ base: 130, lg: 195, xl: 260 }}
              w="auto"
              fit="contain"
            />
          </Group>
          <Image
            src={logoMaxPlanck}
            alt="Max Planck"
            h={{ base: 125, lg: 188, xl: 250 }}
            w="auto"
            fit="contain"
          />
        </Stack>
      </Box>
      <Center flex={1} px="md">
        <Container size={420} w="100%">
          <Stack gap="xs" mb="xl">
            <Title order={1} ta="center" className={classes.title} hiddenFrom="md">
              Bienvenido a <span className={classes.highlight}>Colegios y Academia Max Planck</span>
            </Title>
            <Title order={1} ta="center" className={classes.title} visibleFrom="md">
              Iniciar sesión
            </Title>
            <Text c="dimmed" size="sm" ta="center">
              Ingresa con tu documento de identidad y tu contraseña.
            </Text>
          </Stack>

          <Paper withBorder shadow="sm" p="xl">
            <form noValidate onSubmit={form.onSubmit((values) => loginMutation.mutate(values))}>
              <Stack gap="md">
                {loginMutation.isError && <ApiErrorAlert error={loginMutation.error} />}
                <TextInput
                  label="Usuario"
                  description="Es tu documento de identidad, sin espacios ni guiones."
                  placeholder="Ej. 45678912"
                  autoComplete="username"
                  required
                  data-autofocus
                  key={form.key('userName')}
                  {...form.getInputProps('userName')}
                />
                <PasswordInput
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                  required
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />
                <Button fullWidth mt="xs" type="submit" loading={loginMutation.isPending}>
                  Iniciar sesión
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
      </Center>
    </Flex>
  )
}

export default LoginPage
