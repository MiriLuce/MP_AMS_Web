import { Button, Group, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { districtsQueryOptions } from '@/core/api/catalogs/queries'
import type { ApiError } from '@/core/api/errors'
import ApiErrorAlert from '@/shared/ApiErrorAlert'
import AccountBlock from './AccountBlock'
import FieldGrid from './FieldGrid'
import { updateMe } from './api'
import {
  findUbigeo,
  toContactFormValues,
  toUpdateRequest,
  type ContactFormValues,
} from './contactFormValues'
import { meQueryOptions } from './queries'
import type { MeResponse, PersonResponse, UpdateMyContactInfoRequest } from './types'

type Props = { person: PersonResponse; onDone: () => void }

function ContactForm({ person, onDone }: Props) {
  const queryClient = useQueryClient()
  const form = useForm<ContactFormValues>({
    mode: 'controlled',
    initialValues: toContactFormValues(person),
  })

  const { departmentId, provinceId, districtId } = form.values
  const districtsQuery = useQuery({
    ...districtsQueryOptions(Number(departmentId), Number(provinceId)),
    enabled: departmentId !== null && provinceId !== null,
  })
  const isResolvingLocation = districtId !== null && districtsQuery.isPending

  const updateMutation = useMutation<MeResponse, ApiError, UpdateMyContactInfoRequest>({
    mutationFn: updateMe,
    onSuccess: (me) => {
      queryClient.setQueryData(meQueryOptions.queryKey, me)
      onDone()
    },
  })

  const handleSubmit = (values: ContactFormValues) => {
    updateMutation.mutate(
      toUpdateRequest(values, findUbigeo(values.districtId, districtsQuery.data)),
    )
  }

  return (
    <AccountBlock title="Contacto">
      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {updateMutation.isError && <ApiErrorAlert error={updateMutation.error} />}
          {districtsQuery.isError && <ApiErrorAlert error={districtsQuery.error} />}
          <FieldGrid>
            <TextInput label="Correo electrónico" type="email" {...form.getInputProps('email')} />
            <TextInput label="Dirección" {...form.getInputProps('address')} />
            <TextInput label="Referencia" {...form.getInputProps('addressReference')} />
          </FieldGrid>
          <Group justify="flex-end">
            <Button variant="default" onClick={onDone} disabled={updateMutation.isPending}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={updateMutation.isPending}
              disabled={isResolvingLocation || districtsQuery.isError}
            >
              Guardar
            </Button>
          </Group>
        </Stack>
      </form>
    </AccountBlock>
  )
}

export default ContactForm
