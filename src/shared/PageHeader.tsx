import { Title } from '@mantine/core'

function PageHeader({ title }: { title: string }) {
  return (
    <Title order={2} mb="md">
      {title}
    </Title>
  )
}

export default PageHeader
