import { describe, expect, it } from 'vitest'
import type { DistrictResponse } from '@/core/api/catalogs/types'
import {
  addPhone,
  ensureOneMain,
  findUbigeo,
  removePhone,
  setMainPhone,
  toContactFormValues,
  toFormErrors,
  toUpdateRequest,
  type ContactFormValues,
  type PhoneFormValue,
} from './contactFormValues'
import type { PersonPhoneResponse, PersonResponse } from './types'

function phoneResponse(overrides: Partial<PersonPhoneResponse>): PersonPhoneResponse {
  return {
    phoneId: 1,
    phoneType: { id: 1, displayName: 'Celular' },
    number: '987654321',
    isMain: false,
    description: null,
    isActive: true,
    ...overrides,
  }
}

function person(overrides: Partial<PersonResponse> = {}): PersonResponse {
  return {
    personId: 10,
    typeDocument: { id: 1, displayName: 'DNI' },
    documentIdentity: '72782793',
    firstName: 'Miriam',
    middleName: null,
    fatherLastName: 'Encarnacion',
    motherLastName: null,
    gender: null,
    birthDate: null,
    email: 'miriam@test.com',
    address: 'Av. La Arboleda 484',
    addressReference: 'Frente al colegio',
    birthCountry: { id: 1, displayName: 'Perú' },
    residentLocation: {
      department: { id: 15, displayName: 'Lima' },
      province: { id: 1, displayName: 'Lima' },
      district: { id: 14, displayName: 'La Molina' },
    },
    phones: [],
    ...overrides,
  }
}

function phone(overrides: Partial<PhoneFormValue>): PhoneFormValue {
  return {
    key: 'k',
    phoneId: null,
    phoneTypeId: '1',
    number: '987654321',
    description: '',
    isMain: false,
    isActive: true,
    ...overrides,
  }
}

const mainKeys = (phones: PhoneFormValue[]) =>
  phones.filter((p) => p.isActive && p.isMain).map((p) => p.key)

describe('toContactFormValues', () => {
  it('maps the contact fields and the location ids', () => {
    expect(toContactFormValues(person())).toMatchObject({
      email: 'miriam@test.com',
      address: 'Av. La Arboleda 484',
      addressReference: 'Frente al colegio',
      departmentId: '15',
      provinceId: '1',
      districtId: '14',
    })
  })

  it('keeps the address when there is no district', () => {
    const values = toContactFormValues(person({ residentLocation: null }))

    expect(values.address).toBe('Av. La Arboleda 484')
    expect(values.departmentId).toBeNull()
  })

  it('lists the main phone first', () => {
    const values = toContactFormValues(
      person({
        phones: [
          phoneResponse({ phoneId: 1, number: '911111111' }),
          phoneResponse({ phoneId: 2, number: '922222222', isMain: true }),
        ],
      }),
    )

    expect(values.phones.map((p) => p.phoneId)).toEqual([2, 1])
  })

  it('keeps inactive phones so they are resent unchanged', () => {
    const values = toContactFormValues(
      person({
        phones: [
          phoneResponse({ phoneId: 1, isMain: true }),
          phoneResponse({ phoneId: 2, isActive: false }),
        ],
      }),
    )

    expect(values.phones).toHaveLength(2)
    expect(values.phones.find((p) => p.phoneId === 2)?.isActive).toBe(false)
  })

  it('fixes legacy data with no main phone', () => {
    const values = toContactFormValues(
      person({ phones: [phoneResponse({ phoneId: 1 }), phoneResponse({ phoneId: 2 })] }),
    )

    expect(values.phones.filter((p) => p.isMain)).toHaveLength(1)
  })
})

describe('main phone rules', () => {
  it('setMainPhone marks exactly the chosen active phone', () => {
    const phones = [phone({ key: 'a', isMain: true }), phone({ key: 'b' })]

    expect(mainKeys(setMainPhone(phones, 'b'))).toEqual(['b'])
  })

  it('setMainPhone leaves inactive phones untouched', () => {
    const phones = [phone({ key: 'a' }), phone({ key: 'x', isActive: false, isMain: true })]

    expect(setMainPhone(phones, 'a').find((p) => p.key === 'x')?.isMain).toBe(true)
  })

  it('ensureOneMain keeps the existing main when there is exactly one', () => {
    const phones = [phone({ key: 'a' }), phone({ key: 'b', isMain: true })]

    expect(mainKeys(ensureOneMain(phones))).toEqual(['b'])
  })

  it('ensureOneMain picks the first active phone when none is main', () => {
    const phones = [phone({ key: 'x', isActive: false }), phone({ key: 'a' }), phone({ key: 'b' })]

    expect(mainKeys(ensureOneMain(phones))).toEqual(['a'])
  })

  it('ensureOneMain keeps only the first of two mains', () => {
    const phones = [phone({ key: 'a', isMain: true }), phone({ key: 'b', isMain: true })]

    expect(mainKeys(ensureOneMain(phones))).toEqual(['a'])
  })

  it('addPhone makes the first active phone main', () => {
    const [added] = addPhone([])

    expect(added.isMain).toBe(true)
    expect(added.phoneId).toBeNull()
  })

  it('addPhone does not take the main from an existing phone', () => {
    expect(mainKeys(addPhone([phone({ key: 'a', isMain: true })]))).toEqual(['a'])
  })

  it('removePhone promotes the first remaining phone when the main is removed', () => {
    const phones = [phone({ key: 'a', isMain: true }), phone({ key: 'b' }), phone({ key: 'c' })]

    expect(mainKeys(removePhone(phones, 'a'))).toEqual(['b'])
  })

  it('removePhone can remove the last phone', () => {
    expect(removePhone([phone({ key: 'a', isMain: true })], 'a')).toEqual([])
  })
})

describe('findUbigeo', () => {
  const districts: DistrictResponse[] = [
    {
      departmentId: 15,
      provinceId: 1,
      districtId: 14,
      name: 'La Molina',
      ubigeo: '140110',
      isDefault: false,
    },
  ]

  it('returns the ubigeo of the chosen district', () => {
    expect(findUbigeo('14', districts)).toBe('140110')
  })

  it('returns null without a district or before the list loads', () => {
    expect(findUbigeo(null, districts)).toBeNull()
    expect(findUbigeo('14', undefined)).toBeNull()
  })
})

describe('toUpdateRequest', () => {
  const values: ContactFormValues = {
    email: '  ',
    address: ' Calle 1 ',
    addressReference: '',
    departmentId: '15',
    provinceId: '1',
    districtId: '14',
    phones: [phone({ phoneId: 5, number: ' 987654321 ', description: '', isMain: true })],
  }

  it('turns blank text into null and trims the rest', () => {
    expect(toUpdateRequest(values, '140110')).toMatchObject({
      email: null,
      address: 'Calle 1',
      addressReference: null,
      residentUbigeo: '140110',
    })
  })

  it('sends phones with numeric ids and without the form-only key', () => {
    expect(toUpdateRequest(values, '140110').phones).toEqual([
      {
        phoneId: 5,
        phoneTypeId: 1,
        number: '987654321',
        isMain: true,
        description: null,
        isActive: true,
      },
    ])
  })
})

describe('toFormErrors', () => {
  const values = toContactFormValues(
    person({
      phones: [
        phoneResponse({ phoneId: 1, isMain: true }),
        phoneResponse({ phoneId: 2, isActive: false }),
      ],
    }),
  )

  it('maps backend paths to form paths', () => {
    const { fieldErrors, hasUnmappedErrors } = toFormErrors(
      { email: ['Correo inválido'], 'phones[0].number': ['Número inválido'] },
      values,
    )

    expect(fieldErrors).toEqual({ email: 'Correo inválido', 'phones.0.number': 'Número inválido' })
    expect(hasUnmappedErrors).toBe(false)
  })

  it('shows a residentUbigeo error on the district', () => {
    expect(toFormErrors({ residentUbigeo: ['Falta la ubicación'] }, values).fieldErrors).toEqual({
      districtId: 'Falta la ubicación',
    })
  })

  it('flags an error on a hidden inactive phone as unmapped', () => {
    const { fieldErrors, hasUnmappedErrors } = toFormErrors(
      { 'phones[1].number': ['Número inválido'] },
      values,
    )

    expect(fieldErrors).toEqual({})
    expect(hasUnmappedErrors).toBe(true)
  })

  it('flags an error on a field the form does not show as unmapped', () => {
    expect(toFormErrors({ firstName: ['No editable'] }, values).hasUnmappedErrors).toBe(true)
  })
})
