import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import AppLayout from './components/layout/AppLayout'
import ErrorBoundary from './components/ui/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
