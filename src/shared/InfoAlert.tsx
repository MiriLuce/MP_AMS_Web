import { Alert } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import type { ReactNode } from 'react'

type Props = { title: string; message: ReactNode }

function InfoAlert({ title, message }: Props) {
  return (
    <Alert variant="light" title={title} icon={<IconInfoCircle />}>
      {message}
    </Alert>
  )
}

export default InfoAlert
