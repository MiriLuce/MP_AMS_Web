import { ActionIcon, Button, Group, Radio, Select, Stack, Text, TextInput } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import { IconPlus, IconTrash } from '@tabler/icons-react'
import type { PhoneTypeResponse } from '@/core/api/catalogs/types'
import {
  addPhone,
  removePhone,
  setMainPhone,
  type ContactFormValues,
  type PhoneFormValue,
} from './contactFormValues'

type Props = {
  form: UseFormReturnType<ContactFormValues>
  phoneTypes: PhoneTypeResponse[] | undefined
}

function PhoneFields({ form, phoneTypes }: Props) {
  const phones = form.values.phones
  const activePhones = phones.filter((phone) => phone.isActive)
  const mainKey = activePhones.find((phone) => phone.isMain)?.key ?? null
  const phoneTypeOptions = phoneTypes?.map((type) => ({
    value: String(type.phoneTypeId),
    label: type.name,
  }))

  const replacePhones = (next: PhoneFormValue[]) => {
    form.setFieldValue('phones', next)
    Object.keys(form.errors)
      .filter((path) => path.startsWith('phones.'))
      .forEach((path) => form.clearFieldError(path))
  }

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        Teléfonos
      </Text>
      {activePhones.length === 0 && (
        <Text size="sm" c="dimmed">
          No tienes teléfonos registrados.
        </Text>
      )}
      <Radio.Group
        value={mainKey}
        onChange={(key) => form.setFieldValue('phones', setMainPhone(phones, key))}
      >
        <Stack gap="sm">
          {phones.map(
            (phone, index) =>
              phone.isActive && (
                <Group key={phone.key} align="flex-start" gap="sm">
                  <Select
                    label="Tipo"
                    w={150}
                    data={phoneTypeOptions}
                    {...form.getInputProps(`phones.${index}.phoneTypeId`)}
                  />
                  <TextInput
                    label="Número"
                    w={170}
                    {...form.getInputProps(`phones.${index}.number`)}
                  />
                  <TextInput
                    label="Descripción"
                    miw={170}
                    style={{ flex: 1 }}
                    {...form.getInputProps(`phones.${index}.description`)}
                  />
                  <Radio value={phone.key} label="Principal" mt={34} />
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    mt={28}
                    aria-label="Quitar teléfono"
                    onClick={() => replacePhones(removePhone(phones, phone.key))}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
          )}
        </Stack>
      </Radio.Group>
      <Group>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<IconPlus size={14} />}
          onClick={() => form.setFieldValue('phones', addPhone(phones))}
        >
          Agregar teléfono
        </Button>
      </Group>
    </Stack>
  )
}

export default PhoneFields
