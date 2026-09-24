import { useState } from 'react'
import { Badge, Button, Table, Text } from '@mantine/core'
import { IconPencil } from '@tabler/icons-react'
import { formatPhoneNumber } from '@/shared/phoneRule'
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
  const activePhones = person.phones
    .filter((phone) => phone.isActive)
    .toSorted((a, b) => Number(b.isMain) - Number(a.isMain))

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
          label="Ubicación"
          value={
            location &&
            `${location.district.displayName}, ${location.province.displayName}, ${location.department.displayName}`
          }
        />
        <Field label="Dirección" value={person.address} />
        <Field label="Referencia" value={person.addressReference} />
      </FieldGrid>
      <Field
        label="Teléfonos"
        value={
          activePhones.length > 0 ? (
            <Table.ScrollContainer minWidth={420} type="native">
              <Table
                w="auto"
                withRowBorders={false}
                verticalSpacing={4}
                styles={{ td: { paddingLeft: 0, paddingRight: 'var(--mantine-spacing-xl)' } }}
              >
                <Table.Tbody>
                  {activePhones.map((phone) => (
                    <Table.Tr key={phone.phoneId}>
                      <Table.Td>
                        <Text>{formatPhoneNumber(phone.number)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {phone.phoneType.displayName}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {phone.description}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        {phone.isMain && (
                          <Badge size="sm" variant="light">
                            Principal
                          </Badge>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          ) : null
        }
      />
    </AccountBlock>
  )
}

export default ContactBlock
