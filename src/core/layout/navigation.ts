import { IconHome, type TablerIcon } from '@tabler/icons-react'

export type NavItem = {
  to: string
  label: string
  Icon: TablerIcon
  anyOf?: readonly string[]
}

export const NAV_ITEMS: readonly NavItem[] = [{ to: '/', label: 'Inicio', Icon: IconHome }]

export function visibleNavItems(items: readonly NavItem[], permissions: ReadonlySet<string>) {
  return items.filter((item) => !item.anyOf || item.anyOf.some((p) => permissions.has(p)))
}
