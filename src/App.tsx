import { Container, Button, Title } from '@mantine/core'
import { Route, Routes } from 'react-router'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Container>
            <Title order={1}>Welcome to Vite + React! MPAMS proyect</Title>
            <Button>Submit</Button>
          </Container>
        }
      />
    </Routes>
  )
}

export default App
