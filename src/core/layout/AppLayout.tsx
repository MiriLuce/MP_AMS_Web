import { AppShell, Group, NavLink, Title } from '@mantine/core'
import { useMatch, NavLink as RouterNavLink, Outlet } from 'react-router'

function NavLinkItem({ to, label }: { to: string; label: string }) {
  const match = useMatch({ path: to, end: to === '/' })
  return <NavLink component={RouterNavLink} to={to} label={label} active={match !== null} />
}

function AppLayout() {
  return (
    <AppShell header={{ height: 60 }} navbar={{ width: 260, breakpoint: 'sm' }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md">
          <Title order={3}>Colegios y Academia Max Planck</Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar>
        <NavLinkItem to="/" label="Inicio" />
        <NavLinkItem to="/academic-years" label="Años Escolares" />
        <NavLinkItem to="/employees" label="Empleados" />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default AppLayout
