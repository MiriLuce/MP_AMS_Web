import { List } from '@mantine/core'
import InfoAlert from '@/shared/InfoAlert'
import { PASSWORD_REQUIREMENTS } from './passwordRules'

function PasswordRequirements({ title }: { title: string }) {
  return (
    <InfoAlert
      title={title}
      message={
        <List size="sm" spacing={2} mt="xs">
          {PASSWORD_REQUIREMENTS.map((requirement) => (
            <List.Item key={requirement}>{requirement}</List.Item>
          ))}
        </List>
      }
    />
  )
}

export default PasswordRequirements
