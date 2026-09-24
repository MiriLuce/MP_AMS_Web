import { Badge, Group, Text } from '@mantine/core'
import { formatDate } from '@/shared/formatDate'
import AccountBlock from './AccountBlock'
import FieldGrid from './FieldGrid'
import Field from './Field'
import type { MeEmploymentResponse } from './types'

type Props = { employment: MeEmploymentResponse | null; roles: string[] }

function EmploymentBlock({ employment, roles }: Props) {
  return (
    <AccountBlock title="Empleo">
      <FieldGrid>
        {employment ? (
          <>
            <Field label="Cargo en la institución" value={employment.jobTitle.displayName} />
            <Field label="Estado" value={employment.status.displayName} />
            <Field label="Fecha de ingreso" value={formatDate(employment.admissionDate)} />
          </>
        ) : (
          <Field
            label="Cargo en la institución"
            value="No tienes un contrato vigente registrado."
          />
        )}
        <Field
          label="Roles en el sistema"
          value={
            roles.length > 0 ? (
              <Group gap="xs">
                {roles.map((role) => (
                  <Badge key={role} variant="light">
                    {role}
                  </Badge>
                ))}
              </Group>
            ) : (
              <Text>Sin roles asignados</Text>
            )
          }
        />
      </FieldGrid>
    </AccountBlock>
  )
}

export default EmploymentBlock
