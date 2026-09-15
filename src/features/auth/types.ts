export type UserInfoResponse = {
  userId: number
  userName: string
  typeDocumentIdentity: string
  documentIdentity: string
  firstName: string
  middleName: string | null
  fatherLastName: string
  motherLastName: string | null
  email: string
  roles: string[]
}

export type LoginResponse = {
  accessToken: string
  tokenType: string
  expiresIn: number
  mustChangePassword: boolean
  user: UserInfoResponse
}

export type LoginRequest = {
  userName: string
  password: string
}

export type ChangePasswordRequest = {
  currentPassword: string
  newPassword: string
}

export type ChangePasswordResponse = {
  message: string
}
