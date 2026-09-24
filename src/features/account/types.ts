export type Gender = 'Male' | 'Female' | 'Other'

export type EmployeeStatus =
  'Active' | 'OnLeave' | 'Suspended' | 'Resigned' | 'Retired' | 'Terminated'

export type EnumValue<T extends string> = {
  code: T
  displayName: string
}

export type Lookup<T extends string> = {
  id: number
  displayName: string
  readonly __catalog?: T
}

export type TypeDocumentLookup = Lookup<'typeDocumentIdentity'>
export type CountryLookup = Lookup<'country'>
export type DepartmentLookup = Lookup<'department'>
export type ProvinceLookup = Lookup<'province'>
export type DistrictLookup = Lookup<'district'>
export type PhoneTypeLookup = Lookup<'phoneType'>
export type JobTitleLookup = Lookup<'jobTitle'>

export type PersonResidentLocationResponse = {
  department: DepartmentLookup
  province: ProvinceLookup
  district: DistrictLookup
}

export type PersonPhoneResponse = {
  phoneId: number
  phoneType: PhoneTypeLookup
  number: string
  isMain: boolean
  description: string | null
  isActive: boolean
}

export type PersonResponse = {
  personId: number
  typeDocument: TypeDocumentLookup
  documentIdentity: string
  firstName: string
  middleName: string | null
  fatherLastName: string
  motherLastName: string | null
  gender: EnumValue<Gender> | null
  birthDate: string | null
  email: string | null
  address: string | null
  addressReference: string | null
  birthCountry: CountryLookup
  residentLocation: PersonResidentLocationResponse | null
  phones: PersonPhoneResponse[]
}

export type MeEmploymentResponse = {
  jobTitle: JobTitleLookup
  status: EnumValue<EmployeeStatus>
  admissionDate: string
}

export type MeResponse = {
  userId: number
  userName: string
  roles: string[]
  employment: MeEmploymentResponse | null
  person: PersonResponse
}

export type UpdatePersonPhoneRequest = {
  phoneId: number | null
  phoneTypeId: number
  number: string
  isMain: boolean
  description: string | null
  isActive: boolean
}

export type UpdateMyContactInfoRequest = {
  email: string | null
  residentUbigeo: string | null
  address: string | null
  addressReference: string | null
  phones: UpdatePersonPhoneRequest[]
}
