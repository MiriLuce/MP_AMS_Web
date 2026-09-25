import StatusPage from './StatusPage'

function NotFoundPage() {
  return (
    <StatusPage
      code={404}
      title="Página no encontrada"
      message="La página que estás buscando no existe."
    />
  )
}

export default NotFoundPage
