import { randomId } from '@mantine/hooks'
import type { DistrictResponse } from '@/core/api/catalogs/types'
import type { PersonResponse, UpdateMyContactInfoRequest } from './types'

export type PhoneFormValue = {
  key: string
  phoneId: number | null
  phoneTypeId: string | null
  number: string
  description: string
  isMain: boolean
  isActive: boolean
}

export type ContactFormValues = {
  email: string
  address: string
  addressReference: string
  departmentId: string | null
  provinceId: string | null
  districtId: string | null
  phones: PhoneFormValue[]
}

export function toContactFormValues(person: PersonResponse): ContactFormValues {
  const location = person.residentLocation

  return {
    email: person.email ?? '',
    address: location?.address ?? '',
    addressReference: location?.addressReference ?? '',
    departmentId: location ? String(location.department.id) : null,
    provinceId: location ? String(location.province.id) : null,
    districtId: location ? String(location.district.id) : null,
    phones: person.phones.map((phone) => ({
      key: randomId(),
      phoneId: phone.phoneId,
      phoneTypeId: String(phone.phoneType.id),
      number: phone.number,
      description: phone.description ?? '',
      isMain: phone.isMain,
      isActive: phone.isActive,
    })),
  }
}

export function findUbigeo(
  districtId: string | null,
  districts: DistrictResponse[] | undefined,
): string | null {
  if (districtId === null) return null
  return districts?.find((district) => district.districtId === Number(districtId))?.ubigeo ?? null
}

const emptyToNull = (value: string) => value.trim() || null

export function toUpdateRequest(
  values: ContactFormValues,
  residentUbigeo: string | null,
): UpdateMyContactInfoRequest {
  return {
    email: emptyToNull(values.email),
    residentUbigeo,
    address: emptyToNull(values.address),
    addressReference: emptyToNull(values.addressReference),
    phones: values.phones.map((phone) => ({
      phoneId: phone.phoneId,
      phoneTypeId: Number(phone.phoneTypeId),
      number: phone.number.trim(),
      isMain: phone.isMain,
      description: emptyToNull(phone.description),
      isActive: phone.isActive,
    })),
  }
}

const FIELD_ALIASES: Record<string, string> = { residentUbigeo: 'districtId' }

const FORM_FIELDS =
  /^(email|address|addressReference|districtId|phones\.\d+\.(phoneTypeId|number|description))$/

export function toFormErrors(errors: Record<string, string[]>) {
  const fieldErrors: Record<string, string> = {}
  let hasUnmappedErrors = false

  for (const [key, messages] of Object.entries(errors)) {
    const path = key.replace(/\[(\d+)\]/g, '.$1')
    const field = FIELD_ALIASES[path] ?? path
    if (FORM_FIELDS.test(field)) {
      fieldErrors[field] = messages[0]
    } else {
      hasUnmappedErrors = true
    }
  }

  return { fieldErrors, hasUnmappedErrors }
}
