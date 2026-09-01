type ValidationError = {
  kind: 'validation'
  message: string
  code: 'VALIDATION_FAILED'
  traceId: string
  errors: Record<string, string[]>
}
type UnauthenticatedError = {
  kind: 'unauthenticated'
  message: string
  code: 'AUTH_UNAUTHENTICATED'
  traceId: string
}
type ForbiddenError = {
  kind: 'forbidden'
  message: string
  code: 'AUTH_FORBIDDEN'
  traceId: string
}
type BusinessError = {
  kind: 'business'
  message: string
  code: 'EM_ENROLLMENT_ALREADY_EXISTS' | 'IN_INSTITUTION_NOT_FOUND' | (string & {})
  traceId: string
}
type UnknownError = {
  kind: 'unknown'
  message: string
  code: 'UNEXPECTED_ERROR'
  traceId: string
}
type NetworkError = {
  kind: 'network'
  message: string
  code: 'ECONNABORTED' | 'ERR_NETWORK' | 'ETIMEDOUT'
}

export type ApiError =
  | ValidationError
  | ForbiddenError
  | UnauthenticatedError
  | BusinessError
  | UnknownError
  | NetworkError
