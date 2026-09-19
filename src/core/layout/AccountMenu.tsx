import { Avatar, Menu, Stack, UnstyledButton, Text, Group } from '@mantine/core'
import { IconPasswordUser, IconLogout } from '@tabler/icons-react'
import { useSessionStore } from '@/core/session/store'
import { Link } from 'react-router'

function AccountMenu() {
  const displayName = useSessionStore((state) => state?.authState?.displayName ?? null)
  const avatarName = useSessionStore((state) => state?.authState?.avatarName ?? null)
  const userName = useSessionStore((state) => state?.authState?.userName ?? null)
  const endSession = useSessionStore((state) => state.endSession)

  return (
    <Menu width={240}>
      <Menu.Target>
        <UnstyledButton aria-label="Cuenta de usuario">
          <Group gap="xs">
            <Avatar>{avatarName}</Avatar>
            <Text truncate maw={160} visibleFrom="sm">
              {displayName}
            </Text>
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>
          <Stack gap={2}>
            <Text size="sm" fw={500} truncate>
              {displayName}
            </Text>
            <Text size="xs" c="dimmed" truncate>
              {userName}
            </Text>
          </Stack>
        </Menu.Label>
        <Menu.Divider />
        {/* `component={Link}` va en el `Menu.Item`, que es el elemento clickeable: esto navega a
            otra URL, así que tiene que ser un `<a href>` de verdad — ctrl+clic, clic del medio y
            “abrir en pestaña nueva” funcionan, y el navegador muestra el destino. `Link` navega
            del lado del cliente, sin recargar. “Cerrar sesión” sí es una acción: se queda botón. */}
        <Menu.Item
          component={Link}
          to="/change-password"
          leftSection={<IconPasswordUser size={14} />}
        >
          Cambiar contraseña
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={14} />} onClick={endSession}>
          Cerrar sesión
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default AccountMenu
