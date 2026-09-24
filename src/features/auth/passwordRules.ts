export const MIN_PASSWORD_LENGTH = 8

const HAS_UPPERCASE = /[A-Z]/
const HAS_LOWERCASE = /[a-z]/
const HAS_DIGIT = /[0-9]/
const IS_ASCII_LETTER_OR_DIGIT = /[A-Za-z0-9]/

const SPECIAL_CHARACTERS = '!@#$%&*-_.?'
const SPECIAL_CHARACTERS_DISPLAY = [...SPECIAL_CHARACTERS].join(' ')

export const PASSWORD_REQUIREMENTS = [
  `Al menos ${MIN_PASSWORD_LENGTH} caracteres`,
  'Una letra mayúscula y una minúscula',
  'Al menos un dígito',
  `Al menos uno de estos caracteres especiales: ${SPECIAL_CHARACTERS_DISPLAY}`,
  'Solo letras sin tildes ni ñ, dígitos y esos caracteres especiales (sin espacios)',
  'Distinta de tu contraseña actual',
]

export function validateNewPassword(value: string, currentPassword: string | null): string | null {
  if (!value.trim()) {
    return 'La nueva contraseña es obligatoria.'
  }
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
  }
  if (!HAS_UPPERCASE.test(value)) {
    return 'La nueva contraseña debe contener al menos una letra mayúscula.'
  }
  if (!HAS_LOWERCASE.test(value)) {
    return 'La nueva contraseña debe contener al menos una letra minúscula.'
  }
  if (!HAS_DIGIT.test(value)) {
    return 'La nueva contraseña debe contener al menos un dígito.'
  }
  if (![...value].some((char) => SPECIAL_CHARACTERS.includes(char))) {
    return `La nueva contraseña debe contener al menos uno de estos caracteres especiales: ${SPECIAL_CHARACTERS_DISPLAY}`
  }
  if (
    ![...value].every(
      (char) => IS_ASCII_LETTER_OR_DIGIT.test(char) || SPECIAL_CHARACTERS.includes(char),
    )
  ) {
    return `La nueva contraseña solo puede contener letras sin tildes ni ñ, dígitos y estos caracteres especiales: ${SPECIAL_CHARACTERS_DISPLAY}`
  }
  if (currentPassword !== null && value === currentPassword) {
    return 'La nueva contraseña debe ser distinta de la actual.'
  }
  return null
}

export function validatePasswordConfirmation(value: string, newPassword: string): string | null {
  if (!value.trim()) {
    return 'Vuelve a ingresar la nueva contraseña.'
  }
  if (value !== newPassword) {
    return 'Las contraseñas no coinciden.'
  }
  return null
}
