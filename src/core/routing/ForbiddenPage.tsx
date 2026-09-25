import StatusPage from './StatusPage'

function ForbiddenPage() {
  return (
    <StatusPage
      code={403}
      title="Acceso denegado"
      message="No tienes permiso para acceder a esta página."
    />
  )
}

export default ForbiddenPage
