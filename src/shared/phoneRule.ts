const ALLOWED_CHARACTERS = /^\+?[0-9 ()-]+$/
const MIN_DIGITS = 6
const MAX_DIGITS = 15
const MAX_LENGTH = 25

const countDigits = (value: string) => value.replace(/\D/g, '').length

export function validatePhoneNumber(value: string): string | null {
  const number = value.trim()
  if (!number) return 'El número de teléfono es obligatorio.'
  if (number.length > MAX_LENGTH) {
    return `El número de teléfono no puede exceder ${MAX_LENGTH} caracteres.`
  }
  if (!ALLOWED_CHARACTERS.test(number)) {
    return 'El número de teléfono solo puede tener dígitos, espacios, guiones, paréntesis y un + al inicio.'
  }
  const digits = countDigits(number)
  if (digits < MIN_DIGITS || digits > MAX_DIGITS) {
    return `El número de teléfono debe tener entre ${MIN_DIGITS} y ${MAX_DIGITS} dígitos.`
  }
  return null
}

const groupCellphone = (digits: string) => digits.replace(/^(\d{3})(\d{3})(\d{3})$/, '$1 $2 $3')

export function formatPhoneNumber(value: string): string {
  const number = value.trim()
  if (!ALLOWED_CHARACTERS.test(number)) return number
  const digits = number.replace(/\D/g, '')

  if (digits.length === 11 && digits.startsWith('51'))
    return `+51 ${groupCellphone(digits.slice(2))}`
  if (number.startsWith('+')) return number
  if (digits.length === 7) return `(01) ${digits.slice(0, 3)} ${digits.slice(3)}`
  if (digits.length !== 9) return number
  if (digits.startsWith('01')) return digits.replace(/^01(\d{3})(\d{4})$/, '(01) $1 $2')
  if (digits.startsWith('0')) return digits.replace(/^(0\d{2})(\d{3})(\d{3})$/, '($1) $2 $3')
  if (digits.startsWith('9')) return groupCellphone(digits)
  return number
}
