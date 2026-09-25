import { Stack, Text, Title } from '@mantine/core'

type Props = { title: string; description?: string }

function PageHeader({ title, description }: Props) {
  return (
    <Stack gap="xs" mb="md">
      <Title order={2}>{title}</Title>
      {description && (
        <Text c="dimmed" size="sm">
          {description}
        </Text>
      )}
    </Stack>
  )
}

export default PageHeader
