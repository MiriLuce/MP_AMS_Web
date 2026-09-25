import { IconHome } from '@tabler/icons-react'
import { describe, expect, it } from 'vitest'
import { visibleNavItems, type NavItem } from './navigation'

const items: NavItem[] = [
  { to: '/', label: 'Inicio', Icon: IconHome },
  { to: '/employees', label: 'Empleados', Icon: IconHome, anyOf: ['HR:Employee.View'] },
  {
    to: '/students',
    label: 'Alumnos',
    Icon: IconHome,
    anyOf: ['SM:Student.View', 'SM:Student.Manage'],
  },
]

const labels = (permissions: string[]) =>
  visibleNavItems(items, new Set(permissions)).map((item) => item.label)

describe('visibleNavItems', () => {
  it('always shows an item that needs no permission', () => {
    expect(labels([])).toEqual(['Inicio'])
  })

  it('hides an item whose permission the session does not have', () => {
    expect(labels(['EM:AcademicYear.Manage'])).not.toContain('Empleados')
  })

  it('shows an item when the session has its permission', () => {
    expect(labels(['HR:Employee.View'])).toContain('Empleados')
  })

  it('shows an item when the session has any one of its permissions', () => {
    expect(labels(['SM:Student.Manage'])).toContain('Alumnos')
  })
})
