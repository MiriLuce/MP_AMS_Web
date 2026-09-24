import { useSyncExternalStore } from 'react'
import { Affix, Alert } from '@mantine/core'
import { IconWifiOff } from '@tabler/icons-react'
import { onlineManager } from '@tanstack/react-query'

const subscribe = (onChange: () => void) => onlineManager.subscribe(onChange)
const isOnline = () => onlineManager.isOnline()

function OfflineNotice() {
  const online = useSyncExternalStore(subscribe, isOnline)

  if (online) return null

  return (
    <Affix position={{ bottom: 20, left: 20 }} zIndex={1000}>
      <Alert variant="filled" color="yellow" title="Sin conexión" icon={<IconWifiOff />} maw={360}>
        Revisa tu conexión a internet. Lo que estabas cargando continuará cuando vuelva.
      </Alert>
    </Affix>
  )
}

export default OfflineNotice
