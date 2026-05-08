import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-layout">
      <Sidebar 
        mobileOpen={mobileOpen}
        onToggle={() => setMobileOpen(prev => !prev)} 
      />

      <div className="main-content">
        <Topbar onToggle={() => setMobileOpen(prev => !prev)} />
        <main className="page-container">
          {children}
        </main>
      </div>
    </div>
  )
}
