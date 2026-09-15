// Espeja `ChangePasswordRequestValidator` del backend, regla por regla y con sus mismos textos.
// Vive acá y no en cada pantalla porque hay dos formularios que definen contraseña (el forzado con
// contraseña temporal y el voluntario): escrita dos veces, la próxima vez que el backend cambie una
// regla se va a actualizar una sola copia, y el síntoma sería un 400 que la pantalla no supo prever.
//
// Regla de fondo: el backend define qué es válido; esto solo lo refleja. Una regla más estricta acá
// no falla del lado seguro — rechaza una contraseña que el servidor habría aceptado.

export const MIN_PASSWORD_LENGTH = 8

const HAS_UPPERCASE = /[A-Z]/
const HAS_LOWERCASE = /[a-z]/
const HAS_DIGIT = /[0-9]/
// El backend pide `[^a-zA-Z0-9]`: cualquier cosa que no sea letra ASCII ni dígito. Una lista cerrada
// de símbolos dejaría afuera contraseñas válidas con `-`, `_`, `=`, `/` o un espacio.
const HAS_SPECIAL = /[^a-zA-Z0-9]/

export const PASSWORD_REQUIREMENTS = [
  `Al menos ${MIN_PASSWORD_LENGTH} caracteres`,
  'Una letra mayúscula y una minúscula',
  'Al menos un dígito',
  'Al menos un carácter que no sea letra ni dígito (por ejemplo: ! @ # $ % & * - _)',
  'Distinta de tu contraseña actual',
]

/**
 * `currentPassword` en `null` significa que no se conoce en esta pantalla, y entonces la regla
 * "distinta de la actual" la aplica el backend (422). No se inventa un valor para compararla.
 */
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
  if (!HAS_SPECIAL.test(value)) {
    return 'La nueva contraseña debe contener al menos un carácter especial.'
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
