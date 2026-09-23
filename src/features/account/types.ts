// Espeja `MeResponse` del backend campo por campo — ver `specs/API_REFERENCE.md` §5
// (`GET /auth/me`) y §13 (`PersonResponse`). Si el contrato cambia, cambia acá primero.

// Los enums del backend viajan como **el nombre del miembro**, no como el valor
// almacenado en la base: `JsonStringEnumConverter` global (§1, Serialización).
// O sea `"Active"`, nunca `"A"` ni un número.
export type Gender = 'Male' | 'Female' | 'Other'

export type EmployeeStatus =
  'Active' | 'OnLeave' | 'Suspended' | 'Resigned' | 'Retired' | 'Terminated'

// Un catálogo anidado en una respuesta de lectura viaja como `{ id, displayName }`
// y nada más (`ADR-005`). El metadato completo —código, `isDefault`, longitud, tipo de
// carácter— vive en el endpoint de catálogo, que es al que se llama para **editar**.
//
// El parámetro `T` no existe en el JSON: es una marca de tipo. Sin ella los seis lookups
// serían el mismo tipo estructural y confundir `birthCountry` con `district` dejaría de
// fallar en `tsc`. El `?` la hace opcional, así que un objeto que llega del backend
// sigue siendo asignable.
export type Lookup<T extends string> = {
  id: number
  displayName: string
  readonly __catalog?: T
}

// `typeDocument.displayName` es la **abreviatura** (`"DNI"`), no el nombre completo:
// es la única excepción, y está decidida en `ADR-005`.
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
  address: string | null
  addressReference: string | null
}

export type PersonPhoneResponse = {
  phoneId: number
  phoneType: PhoneTypeLookup
  number: string
  isMain: boolean
  description: string | null
  // El backend devuelve también los teléfonos dados de baja. Filtrarlos es
  // responsabilidad de la pantalla: mostrar uno inactivo como propio es un dato falso.
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
  gender: Gender | null
  // `DateOnly` del backend → `"YYYY-MM-DD"`. String, no Date: se parsea donde se formatea.
  birthDate: string | null
  email: string | null
  birthCountry: CountryLookup
  // null cuando la persona no tiene distrito asignado.
  residentLocation: PersonResidentLocationResponse | null
  phones: PersonPhoneResponse[]
}

export type MeEmploymentResponse = {
  // El CARGO en la institución. No confundir con `MeResponse.roles`, que es lo que
  // el usuario puede hacer en el sistema. Son dos ejes distintos.
  jobTitle: JobTitleLookup
  status: EmployeeStatus
  admissionDate: string
}

export type MeResponse = {
  userId: number
  // El documento de identidad (ADR-004). Viene de acá porque el JWT no lo lleva.
  userName: string
  // Roles del SISTEMA, no el cargo. Excluye los roles inactivos.
  roles: string[]
  // null cuando el empleado no tiene contrato activo: `jobTitle` y `admissionDate`
  // salen los dos del contrato vigente. Es un 200 válido, no un error.
  employment: MeEmploymentResponse | null
  person: PersonResponse
}
