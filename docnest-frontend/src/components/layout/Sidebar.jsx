import { NavLink, useNavigate } from 'react-router-dom'
import { MdDashboard, MdPeople, MdPersonAdd, MdAccountTree,
         MdUpload, MdHistory, MdSettings, MdMenu, MdClose, MdLogout } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

const navSections = [
  {
    label: 'GENERAL',
    items: [
      { to: '/dashboard', icon: <MdDashboard />, label: 'Dashboard', end: true },
      { to: '/clients', icon: <MdPeople />, label: 'Clients', end: true },
      { to: '/clients/add', icon: <MdPersonAdd />, label: 'Add Client' },
    ],
  },
  {
    label: 'OPERATIONS',
    items: [
      { to: '/family/1', icon: <MdAccountTree />, label: 'Family Tree' },
      { to: '/import', icon: <MdUpload />, label: 'Excel Import' },
      { to: '/activity', icon: <MdHistory />, label: 'Activity Logs' },
      { to: '/settings', icon: <MdSettings />, label: 'Settings' },
    ],
  },
]

export default function Sidebar({ mobileOpen, onToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <>
      {/* Mobile hamburger */}
      <button className="sidebar-hamburger" onClick={onToggle} aria-label="Open menu">
        <MdMenu size={22} />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && <div className="sidebar-overlay" onClick={onToggle} />}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Logo */}
        <div className="sidebar__logo">
          <div className="sidebar__logo-mark">D</div>
          <span className="sidebar__logo-text">DocNest</span>
          <button className="sidebar__close-btn" onClick={onToggle} aria-label="Close menu">
            <MdClose size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {navSections.map((section) => (
            <div key={section.label} className="sidebar__section">
              <p className="sidebar__section-label">{section.label}</p>
              <ul className="sidebar__nav-list">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.end || false}
                      className={({ isActive }) =>
                        `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
                      }
                      onClick={() => { if (mobileOpen) onToggle?.() }}
                    >
                      <span className="sidebar__nav-icon">{item.icon}</span>
                      <span className="sidebar__nav-label">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar__user">
          <div className="sidebar__user-avatar">{initials}</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{user?.fullName || 'User'}</span>
            <span className="sidebar__user-role">{user?.role || 'Employee'}</span>
          </div>
          <button className="sidebar__logout-btn" onClick={handleLogout} title="Logout">
            <MdLogout size={18} />
          </button>
        </div>
      </aside>
    </>
  )
}
