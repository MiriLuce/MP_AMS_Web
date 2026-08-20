import { Stack, Text, Title, Button } from '@mantine/core'
import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <Stack align="center" justify="center">
      <Title order={1}>404 - Página no encontrada</Title>
      <Text>La página que estás buscando no existe.</Text>
      <Button component={Link} to="/">
        Volver al inicio
      </Button>
    </Stack>
  )
}

export default NotFoundPage
