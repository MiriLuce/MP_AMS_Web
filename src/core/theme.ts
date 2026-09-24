import {
  type MantineColorsTuple,
  Avatar,
  AppShell,
  Burger,
  Button,
  Table,
  ThemeIcon,
  Card,
  createTheme,
} from '@mantine/core'

const navy: MantineColorsTuple = [
  '#eff4fb',
  '#d7e3f4',
  '#b0c6e8',
  '#7d9fd9',
  '#456dc4', // ← el primario con primaryShade: 4
  '#304791',
  '#212959', // ← el institucional, intacto
  '#1a2147',
  '#141a39',
  '#0e132a',
]

export const theme = createTheme({
  colors: { navy },
  primaryColor: 'navy',
  primaryShade: 4,
  defaultRadius: 'md',
  autoContrast: true,
  cursorType: 'pointer',
  respectReducedMotion: true,

  fontFamily: "'Inter Variable', 'Inter', 'Segoe UI', system-ui, sans-serif",

  headings: {
    fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', 'Inter Variable', sans-serif",
    fontWeight: '600',
  },
  components: {
    Button: Button.extend({ defaultProps: { variant: 'filled' } }),
    Table: Table.extend({ defaultProps: { highlightOnHover: true } }),
    ThemeIcon: ThemeIcon.extend({ defaultProps: { variant: 'light' } }),
    Card: Card.extend({ defaultProps: { shadow: 'sm' } }),
    Burger: Burger.extend({ defaultProps: { color: 'var(--mantine-color-white)' } }),
    Avatar: Avatar.extend({ defaultProps: { radius: 'xl', variant: 'light' } }),
    AppShell: AppShell.extend({
      styles: {
        header: {
          backgroundColor: 'var(--mantine-color-navy-6)',
          color: 'var(--mantine-color-white)',
          borderBottom: 'none',
        },
      },
    }),
  },
})
