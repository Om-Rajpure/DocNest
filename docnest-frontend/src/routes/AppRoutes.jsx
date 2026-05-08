import { Routes, Route } from 'react-router-dom'
import DashboardPage      from '../pages/DashboardPage'
import ClientListPage     from '../pages/ClientListPage'
import AddClientPage      from '../pages/AddClientPage'
import ClientDetailPage   from '../pages/ClientDetailPage'
import DocumentCenterPage from '../pages/DocumentCenterPage'
import DocumentsPage      from '../pages/DocumentsPage'
import FamilyTreePage     from '../pages/FamilyTreePage'
import ImportPage         from '../pages/ImportPage'
import ActivityPage       from '../pages/ActivityPage'
import SettingsPage       from '../pages/SettingsPage'
import NotFoundPage       from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/"                          element={<DashboardPage />} />
      <Route path="/clients"                   element={<ClientListPage />} />
      <Route path="/clients/add"               element={<AddClientPage />} />
      <Route path="/clients/:id"               element={<ClientDetailPage />} />
      <Route path="/clients/:id/documents"     element={<DocumentCenterPage />} />
      <Route path="/documents"                 element={<DocumentsPage />} />
      <Route path="/documents/:clientId"       element={<DocumentsPage />} />
      <Route path="/family/:clientId"          element={<FamilyTreePage />} />
      <Route path="/import"                    element={<ImportPage />} />
      <Route path="/activity"                  element={<ActivityPage />} />
      <Route path="/settings"                  element={<SettingsPage />} />
      <Route path="*"                          element={<NotFoundPage />} />
    </Routes>
  )
}
