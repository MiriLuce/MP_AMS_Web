import { Button, Table, ThemeIcon, Card, createTheme } from '@mantine/core'

export const theme = createTheme({
  primaryColor: 'indigo',
  defaultRadius: 'md',
  autoContrast: true,
  cursorType: 'pointer',
  respectReducedMotion: true,

  // @fontsource-variable packages register the family with a "Variable" suffix.
  // Without it the browser silently falls back to the system font.
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
  },
})
