import { Container, Loader, Text, Title, Paper } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import ApiErrorAlert from '@/shared/ApiErrorAlert'
import { meQueryOptions } from './queries'

function MyAccountPage() {
  const { data, isError, error, isPending } = useQuery(meQueryOptions)

  return (
    <Container m="30">
      <Title order={2} ta="center">
        Mis datos
      </Title>
      <Paper withBorder shadow="sm" p="xl">
        {isPending && <Loader />}
        {isError && <ApiErrorAlert error={error} />}
        {data && <Text>{data.person.firstName}</Text>}
      </Paper>
    </Container>
  )
}
export default MyAccountPage
