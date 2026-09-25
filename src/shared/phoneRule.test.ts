import { describe, expect, it } from 'vitest'
import { formatPhoneNumber, validatePhoneNumber } from './phoneRule'

describe('validatePhoneNumber', () => {
  it.each(['987654321', '987 654 321', '(01) 234-5678', '+51 987 654 321', '064-123456'])(
    'accepts %s',
    (number) => {
      expect(validatePhoneNumber(number)).toBeNull()
    },
  )

  it('requires a value', () => {
    expect(validatePhoneNumber('   ')).toBe('El número de teléfono es obligatorio.')
  })

  it.each(['llamar luego', '987-65a-321', '98765#4321', '987+654321'])(
    'rejects characters other than digits and separators in %s',
    (number) => {
      expect(validatePhoneNumber(number)).toBe(
        'El número de teléfono solo puede tener dígitos, espacios, guiones, paréntesis y un + al inicio.',
      )
    },
  )

  it.each(['12345', '1234567890123456'])('rejects %s for its digit count', (number) => {
    expect(validatePhoneNumber(number)).toBe(
      'El número de teléfono debe tener entre 6 y 15 dígitos.',
    )
  })

  it('rejects more than 25 characters', () => {
    expect(validatePhoneNumber('9 8 7 6 5 4 3 2 1 0 1 2 3 4')).toBe(
      'El número de teléfono no puede exceder 25 caracteres.',
    )
  })
})

describe('formatPhoneNumber', () => {
  it.each([
    ['987654321', '987 654 321'],
    ['987-654-321', '987 654 321'],
    ['2345678', '(01) 234 5678'],
    ['234-5678', '(01) 234 5678'],
    ['012345678', '(01) 234 5678'],
    ['(01)2345678', '(01) 234 5678'],
    ['064123456', '(064) 123 456'],
    ['(064) 123456', '(064) 123 456'],
    ['+51987654321', '+51 987 654 321'],
    ['51987654321', '+51 987 654 321'],
  ])('formats %s as %s', (input, expected) => {
    expect(formatPhoneNumber(input)).toBe(expected)
  })

  it.each(['+1 305 555 0100', '12345678', '123456789', '98765432a'])(
    'leaves %s as typed',
    (input) => {
      expect(formatPhoneNumber(input)).toBe(input)
    },
  )

  it('trims surrounding spaces', () => {
    expect(formatPhoneNumber('  12345678  ')).toBe('12345678')
  })
})
