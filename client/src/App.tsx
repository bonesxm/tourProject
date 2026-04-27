import { RouterProvider } from 'react-router-dom'
import { routes } from './app/routes/routes'

export default function App() {
  return <RouterProvider router={routes} />
}
