import { formatDate } from '@/shared/formatDate'
import AccountBlock from './AccountBlock'
import Field from './Field'
import type { PersonResponse } from './types'

type Props = { person: PersonResponse }

function IdentityBlock({ person }: Props) {
  const fullName = [
    person.firstName,
    person.middleName,
    person.fatherLastName,
    person.motherLastName,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <AccountBlock title="Identidad">
      <Field label="Nombre completo" value={fullName} />
      <Field
        label="Documento de identidad"
        value={`${person.typeDocument.displayName} ${person.documentIdentity}`}
      />
      <Field label="Género" value={person.gender?.displayName} />
      <Field label="Fecha de nacimiento" value={formatDate(person.birthDate)} />
      <Field label="País de nacimiento" value={person.birthCountry.displayName} />
    </AccountBlock>
  )
}

export default IdentityBlock
