import { AppShell, Burger, Group, NavLink, Title } from '@mantine/core'
import { useMatch, NavLink as RouterNavLink, Outlet } from 'react-router'
import { useDisclosure } from '@mantine/hooks'
import { IconCalendar, IconHome, IconUsers } from '@tabler/icons-react'

function NavLinkItem({
  to,
  label,
  icon,
  onNavigate,
}: {
  to: string
  label: string
  icon: React.ReactNode
  onNavigate?: () => void
}) {
  const match = useMatch({ path: to, end: to === '/' })
  return (
    <NavLink
      component={RouterNavLink}
      to={to}
      label={label}
      leftSection={icon}
      active={match !== null}
      onClick={onNavigate}
    />
  )
}

function AppLayout() {
  const [mobileNavBarOpened, { toggle: toggleMobileNavBar, close: closeMobileNavBar }] =
    useDisclosure(false)
  const [desktopNavBarOpened, { toggle: toggleDesktopNavBar }] = useDisclosure(true)

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
        <Group h="100%" px="md">
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
          <Title order={3}>Colegios y Academia Max Planck</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavLinkItem to="/" label="Inicio" icon={<IconHome />} onNavigate={closeMobileNavBar} />
        <NavLinkItem
          to="/academic-years"
          label="Años Escolares"
          icon={<IconCalendar />}
          onNavigate={closeMobileNavBar}
        />
        <NavLinkItem
          to="/employees"
          label="Empleados"
          icon={<IconUsers />}
          onNavigate={closeMobileNavBar}
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default AppLayout
