import { useState } from 'react'
import { Badge, Button, Group, Stack, Text } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import AccountBlock from './AccountBlock'
import ContactForm from './ContactForm'
import FieldGrid from './FieldGrid'
import Field from './Field'
import type { PersonResponse } from './types'

type Props = { person: PersonResponse }

function ContactBlock({ person }: Props) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return <ContactForm person={person} onDone={() => setIsEditing(false)} />
  }

  const location = person.residentLocation
  const activePhones = person.phones.filter((phone) => phone.isActive)

  return (
    <AccountBlock
      title="Contacto"
      action={
        <Button
          variant="light"
          size="xs"
          leftSection={<IconPencil size={14} />}
          onClick={() => setIsEditing(true)}
        >
          Editar
        </Button>
      }
    >
      <FieldGrid>
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
      </FieldGrid>
    </AccountBlock>
  )
}

export default ContactBlock
