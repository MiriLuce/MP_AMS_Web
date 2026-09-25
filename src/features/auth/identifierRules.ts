export const USER_NAME_MAX_LENGTH = 20

export function validateUserName(value: string): string | null {
  if (!value.trim()) {
    return 'El nombre de usuario es obligatorio.'
  }
  if (value.length > USER_NAME_MAX_LENGTH) {
    return `El nombre de usuario no puede exceder ${USER_NAME_MAX_LENGTH} caracteres.`
  }
  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    return 'El nombre de usuario solo puede contener letras y dígitos, sin espacios, tildes ni símbolos.'
  }
  return null
}
