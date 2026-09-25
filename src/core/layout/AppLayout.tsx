import { AppShell, Burger, Group, NavLink, Title, ThemeIcon } from '@mantine/core'
import { useMatch, NavLink as RouterNavLink, Outlet } from 'react-router'
import { useDisclosure } from '@mantine/hooks'
import type { TablerIcon } from '@tabler/icons-react'
import AccountMenu from '@/core/layout/AccountMenu'
import { BRAND_NAME, BRAND_SHORT_NAME } from '@/core/brand'
import { useSessionStore } from '@/core/session/store'
import { NAV_ITEMS, visibleNavItems } from './navigation'

function NavLinkItem({
  to,
  label,
  Icon,
  onNavigate,
}: {
  to: string
  label: string
  Icon: TablerIcon
  onNavigate?: () => void
}) {
  const match = useMatch({ path: to, end: to === '/' })
  return (
    <NavLink
      component={RouterNavLink}
      to={to}
      label={label}
      leftSection={
        <ThemeIcon size={30}>
          <Icon size={18} />
        </ThemeIcon>
      }
      active={match !== null}
      onClick={onNavigate}
    />
  )
}

function AppLayout() {
  const [mobileNavBarOpened, { toggle: toggleMobileNavBar, close: closeMobileNavBar }] =
    useDisclosure(false)
  const [desktopNavBarOpened, { toggle: toggleDesktopNavBar }] = useDisclosure(true)
  const permissions = useSessionStore((state) => state.authState?.permissions)
  const navItems = visibleNavItems(NAV_ITEMS, permissions ?? new Set())

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileNavBarOpened, desktop: !desktopNavBarOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger
            opened={mobileNavBarOpened}
            onClick={toggleMobileNavBar}
            size="sm"
            hiddenFrom="sm"
          />
          <Burger
            opened={desktopNavBarOpened}
            onClick={toggleDesktopNavBar}
            size="sm"
            visibleFrom="sm"
          />
          <Title visibleFrom="sm" order={3}>
            {BRAND_NAME}
          </Title>
          <Title hiddenFrom="sm" order={3}>
            {BRAND_SHORT_NAME}
          </Title>
          <AccountMenu />
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        {navItems.map((item) => (
          <NavLinkItem
            key={item.to}
            to={item.to}
            label={item.label}
            Icon={item.Icon}
            onNavigate={closeMobileNavBar}
          />
        ))}
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default AppLayout
