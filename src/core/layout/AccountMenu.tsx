import { Avatar, Menu, Stack, UnstyledButton, Text, Group } from '@mantine/core'
import { IconUser, IconPasswordUser, IconLogout } from '@tabler/icons-react'
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
        <Menu.Item component={Link} to="/my-account" leftSection={<IconUser size={14} />}>
          Mi datos
        </Menu.Item>
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
