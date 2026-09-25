import { Button, Stack, Text, Title } from '@mantine/core'
import { Link } from 'react-router'

type Props = { code: number; title: string; message: string }

function StatusPage({ code, title, message }: Props) {
  return (
    <Stack align="center" justify="center">
      <Title order={1}>
        {code} - {title}
      </Title>
      <Text>{message}</Text>
      <Button component={Link} to="/">
        Volver al inicio
      </Button>
    </Stack>
  )
}

export default StatusPage
