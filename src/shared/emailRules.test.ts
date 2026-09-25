import { describe, expect, it } from 'vitest'
import { validateEmail } from './emailRule'

describe('validateEmail', () => {
  it('treats an empty value as valid, since the email is optional', () => {
    expect(validateEmail('   ')).toBeNull()
  })

  it.each(['miriluce@gmail.com', 'nombre.apellido@colegio.edu.pe', 'a+b@x.io'])(
    'accepts %s',
    (email) => {
      expect(validateEmail(email)).toBeNull()
    },
  )

  it.each([
    'no-es-un-correo',
    'miriluce@g',
    'miriluce@gmail.',
    'miriluce@gmail.c',
    'miri luce@gmail.com',
    'miriluce@@gmail.com',
  ])('rejects %s', (email) => {
    expect(validateEmail(email)).toBe('El correo electrónico no es válido.')
  })
})
