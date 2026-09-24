import { Button, Group, Select, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  departmentsQueryOptions,
  districtsQueryOptions,
  phoneTypesQueryOptions,
  provincesQueryOptions,
} from '@/core/api/catalogs/queries'
import type { ApiError } from '@/core/api/errors'
import ApiErrorAlert from '@/shared/ApiErrorAlert'
import { validateEmail } from '@/shared/emailRule'
import { validatePhoneNumber } from '@/shared/phoneRule'
import AccountBlock from './AccountBlock'
import FieldGrid from './FieldGrid'
import PhoneFields from './PhoneFields'
import { updateMe } from './api'
import {
  findUbigeo,
  toFormErrors,
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
    validate: {
      email: validateEmail,
      departmentId: (value) => (value ? null : 'Elige el departamento.'),
      provinceId: (value) => (value ? null : 'Elige la provincia.'),
      districtId: (value) => (value ? null : 'Elige el distrito.'),
      phones: {
        phoneTypeId: (value) => (value ? null : 'El tipo de teléfono es obligatorio.'),
        number: validatePhoneNumber,
        description: (value) =>
          value.trim().length > 200
            ? 'La descripción del teléfono no puede exceder 200 caracteres.'
            : null,
      },
    },
  })

  const { departmentId, provinceId, districtId } = form.values
  const departmentsQuery = useQuery(departmentsQueryOptions)
  const provincesQuery = useQuery({
    ...provincesQueryOptions(Number(departmentId)),
    enabled: departmentId !== null,
  })
  const districtsQuery = useQuery({
    ...districtsQueryOptions(Number(departmentId), Number(provinceId)),
    enabled: departmentId !== null && provinceId !== null,
  })
  const phoneTypesQuery = useQuery(phoneTypesQueryOptions)
  const isResolvingLocation = districtId !== null && districtsQuery.isPending

  const updateMutation = useMutation<MeResponse, ApiError, UpdateMyContactInfoRequest>({
    mutationFn: updateMe,
    onSuccess: (me) => {
      queryClient.setQueryData(meQueryOptions.queryKey, me)
      onDone()
    },
    onError: (error) => {
      if (error.kind === 'validation') {
        form.setErrors(toFormErrors(error.errors, form.values).fieldErrors)
      } else if (error.code === 'PM_DISTRICT_NOT_FOUND') {
        form.setFieldError('districtId', error.message)
      }
    },
  })

  const saveError = updateMutation.error
  const isShownOnFields =
    saveError !== null &&
    ((saveError.kind === 'validation' &&
      !toFormErrors(saveError.errors, form.values).hasUnmappedErrors) ||
      saveError.code === 'PM_DISTRICT_NOT_FOUND')

  const catalogError =
    departmentsQuery.error ?? provincesQuery.error ?? districtsQuery.error ?? phoneTypesQuery.error

  const handleDepartmentChange = (value: string | null) => {
    form.setValues({ departmentId: value, provinceId: null, districtId: null })
    form.clearFieldError('departmentId')
  }

  const handleProvinceChange = (value: string | null) => {
    form.setValues({ provinceId: value, districtId: null })
    form.clearFieldError('provinceId')
  }

  const handleSubmit = (values: ContactFormValues) => {
    updateMutation.mutate(
      toUpdateRequest(values, findUbigeo(values.districtId, districtsQuery.data)),
    )
  }

  return (
    <AccountBlock title="Contacto">
      <form noValidate onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {saveError && !isShownOnFields && <ApiErrorAlert error={saveError} />}
          {catalogError && <ApiErrorAlert error={catalogError} />}
          <FieldGrid>
            <TextInput label="Correo electrónico" type="email" {...form.getInputProps('email')} />
            <Select
              label="Departamento"
              placeholder="Elige un departamento"
              searchable
              required
              allowDeselect={false}
              data={departmentsQuery.data?.map((department) => ({
                value: String(department.departmentId),
                label: department.name,
              }))}
              value={departmentId}
              onChange={handleDepartmentChange}
              error={form.errors.departmentId}
            />
            <Select
              label="Provincia"
              placeholder={departmentId ? 'Elige una provincia' : 'Primero elige el departamento'}
              searchable
              required
              allowDeselect={false}
              disabled={departmentId === null}
              data={provincesQuery.data?.map((province) => ({
                value: String(province.provinceId),
                label: province.name,
              }))}
              value={provinceId}
              onChange={handleProvinceChange}
              error={form.errors.provinceId}
            />
            <Select
              label="Distrito"
              placeholder={provinceId ? 'Elige un distrito' : 'Primero elige la provincia'}
              searchable
              required
              allowDeselect={false}
              disabled={provinceId === null}
              data={districtsQuery.data?.map((district) => ({
                value: String(district.districtId),
                label: district.name,
              }))}
              {...form.getInputProps('districtId')}
            />
            <TextInput label="Dirección" {...form.getInputProps('address')} />
            <TextInput label="Referencia" {...form.getInputProps('addressReference')} />
          </FieldGrid>
          <PhoneFields form={form} phoneTypes={phoneTypesQuery.data} />
          <Group justify="flex-end">
            <Button variant="default" onClick={onDone} disabled={updateMutation.isPending}>
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={updateMutation.isPending}
              disabled={isResolvingLocation || catalogError !== null}
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
