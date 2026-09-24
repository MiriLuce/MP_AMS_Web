import { Center, Container, Loader, Stack, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import ApiErrorAlert from '@/shared/ApiErrorAlert'
import ContactBlock from './ContactBlock'
import EmploymentBlock from './EmploymentBlock'
import IdentityBlock from './IdentityBlock'
import { meQueryOptions } from './queries'

function MyAccountPage() {
  const { data, isError, error, isPending } = useQuery(meQueryOptions)

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={2} mb="md">
          Mis datos
        </Title>
        {isPending && (
          <Center py="xl">
            <Loader />
          </Center>
        )}
        {isError && <ApiErrorAlert error={error} />}
        {data && (
          <>
            <IdentityBlock person={data.person} />
            <EmploymentBlock employment={data.employment} roles={data.roles} />
            <ContactBlock person={data.person} />
          </>
        )}
      </Stack>
    </Container>
  )
}

export default MyAccountPage
