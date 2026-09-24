import type { EmployeeStatus, Gender } from './types'

export const GENDER_LABELS: Record<Gender, string> = {
  Male: 'Masculino',
  Female: 'Femenino',
  Other: 'Otro',
}

export const EMPLOYEE_STATUS_LABELS: Record<EmployeeStatus, string> = {
  Active: 'Activo',
  OnLeave: 'De licencia',
  Suspended: 'Suspendido',
  Resigned: 'Renunció',
  Retired: 'Jubilado',
  Terminated: 'Cesado',
}
