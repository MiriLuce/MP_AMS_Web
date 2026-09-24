import { Badge, Group, Stack, Text } from '@mantine/core'
import AccountBlock from './AccountBlock'
import Field from './Field'
import type { PersonResponse } from './types'

type Props = { person: PersonResponse }

function ContactBlock({ person }: Props) {
  const location = person.residentLocation
  const activePhones = person.phones.filter((phone) => phone.isActive)

  return (
    <AccountBlock title="Contacto">
      <Field label="Correo electrónico" value={person.email} />
      <Field
        label="Teléfonos"
        value={
          activePhones.length > 0 ? (
            <Stack gap={4}>
              {activePhones.map((phone) => (
                <Group key={phone.phoneId} gap="xs">
                  <Text>{phone.number}</Text>
                  <Text size="sm" c="dimmed">
                    {phone.description
                      ? `${phone.phoneType.displayName} · ${phone.description}`
                      : phone.phoneType.displayName}
                  </Text>
                  {phone.isMain && (
                    <Badge size="sm" variant="light">
                      Principal
                    </Badge>
                  )}
                </Group>
              ))}
            </Stack>
          ) : null
        }
      />
      {location && (
        <>
          <Field label="Dirección" value={location.address} />
          <Field label="Referencia" value={location.addressReference} />
          <Field
            label="Ubicación"
            value={`${location.district.displayName}, ${location.province.displayName}, ${location.department.displayName}`}
          />
        </>
      )}
    </AccountBlock>
  )
}

export default ContactBlock
