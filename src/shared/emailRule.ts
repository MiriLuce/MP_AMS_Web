const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/

export function validateEmail(value: string): string | null {
  const email = value.trim()
  if (!email) return null
  return EMAIL_PATTERN.test(email) ? null : 'El correo electrónico no es válido.'
}
