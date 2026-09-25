import { describe, expect, it } from 'vitest'
import { validateNewPassword, validatePasswordConfirmation } from './passwordRules'

describe('validateNewPassword', () => {
  it('accepts a password that meets every rule', () => {
    expect(validateNewPassword('Nueva123!', 'Actual123!')).toBeNull()
  })

  it.each([
    ['', 'La nueva contraseña es obligatoria.'],
    ['Ab1!', 'La nueva contraseña debe tener al menos 8 caracteres.'],
    ['nueva123!', 'La nueva contraseña debe contener al menos una letra mayúscula.'],
    ['NUEVA123!', 'La nueva contraseña debe contener al menos una letra minúscula.'],
    ['NuevaClave!', 'La nueva contraseña debe contener al menos un dígito.'],
  ])('rejects %j', (value, message) => {
    expect(validateNewPassword(value, null)).toBe(message)
  })

  it.each(['!', '@', '#', '$', '%', '&', '*', '-', '_', '.', '?'])(
    'accepts %s as the special character',
    (special) => {
      expect(validateNewPassword(`Nueva123${special}`, null)).toBeNull()
    },
  )

  it('rejects a symbol that is not in the closed list', () => {
    expect(validateNewPassword('Nueva123=', null)).toMatch(
      /al menos uno de estos caracteres especiales/,
    )
  })

  it.each(['Contraseña1!', 'Nueva 123!', 'Nueva123!€'])(
    'rejects %s for a character outside the allowed set',
    (value) => {
      expect(validateNewPassword(value, null)).toMatch(/solo puede contener letras sin tildes ni ñ/)
    },
  )

  it('rejects the current password', () => {
    expect(validateNewPassword('Actual123!', 'Actual123!')).toBe(
      'La nueva contraseña debe ser distinta de la actual.',
    )
  })

  it('skips the "different from current" rule when the current password is unknown', () => {
    expect(validateNewPassword('Actual123!', null)).toBeNull()
  })
})

describe('validatePasswordConfirmation', () => {
  it('requires the confirmation', () => {
    expect(validatePasswordConfirmation('', 'Nueva123!')).toBe(
      'Vuelve a ingresar la nueva contraseña.',
    )
  })

  it('rejects a different value', () => {
    expect(validatePasswordConfirmation('Nueva123?', 'Nueva123!')).toBe(
      'Las contraseñas no coinciden.',
    )
  })

  it('accepts a matching value', () => {
    expect(validatePasswordConfirmation('Nueva123!', 'Nueva123!')).toBeNull()
  })
})
