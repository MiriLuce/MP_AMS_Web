import { Stack, Text, Title, Button } from '@mantine/core'
import { Link } from 'react-router'

function ForbiddenPage() {
  return (
    <Stack align="center" justify="center">
      <Title order={1}>403 - Acceso denegado</Title>
      <Text>No tienes permiso para acceder a esta página.</Text>
      <Button component={Link} to="/">
        Volver al inicio
      </Button>
    </Stack>
  )
}

export default ForbiddenPage
