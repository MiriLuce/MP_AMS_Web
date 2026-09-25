import { describe, expect, it } from 'vitest'
import { validateUserName } from './identifierRules'

describe('validateUserName', () => {
  it.each(['72782793', 'AB123456', 'x'])('accepts %s', (value) => {
    expect(validateUserName(value)).toBeNull()
  })

  it('requires a value', () => {
    expect(validateUserName('  ')).toBe('El nombre de usuario es obligatorio.')
  })

  it('rejects more than 20 characters', () => {
    expect(validateUserName('1'.repeat(21))).toBe(
      'El nombre de usuario no puede exceder 20 caracteres.',
    )
  })

  it.each(['7278 2793', '72-782-793', 'Núñez123'])('rejects %s', (value) => {
    expect(validateUserName(value)).toBe(
      'El nombre de usuario solo puede contener letras y dígitos, sin espacios, tildes ni símbolos.',
    )
  })
})
