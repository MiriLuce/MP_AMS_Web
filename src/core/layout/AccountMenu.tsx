import { Avatar, Menu, Stack, UnstyledButton, Text, Group } from '@mantine/core'
import { IconPasswordUser, IconLogout } from '@tabler/icons-react'
import { useSessionStore } from '@/core/session/store'

function AccountMenu() {
  const displayName = useSessionStore((state) => state?.authState?.displayName ?? null)
  const avatarName = useSessionStore((state) => state?.authState?.avatarName ?? null)
  const userName = useSessionStore((state) => state?.authState?.userName ?? null)

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
        <Menu.Item leftSection={<IconPasswordUser size={14} />}>Cambiar contraseña</Menu.Item>
        <Menu.Divider />
        <Menu.Item leftSection={<IconLogout size={14} />}>Cerrar sesión</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export default AccountMenu
