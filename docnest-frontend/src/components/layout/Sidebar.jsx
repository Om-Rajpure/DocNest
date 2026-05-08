import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { MdDashboard, MdPeople, MdPersonAdd, MdFolder, MdAccountTree,
         MdUpload, MdHistory, MdSettings, MdMenu, MdClose } from 'react-icons/md'
import './Sidebar.css'

const navSections = [
  {
    label: 'GENERAL',
    items: [
      { to: '/', icon: <MdDashboard />, label: 'Dashboard', end: true },
      { to: '/clients', icon: <MdPeople />, label: 'Clients', end: true },
      { to: '/clients/add', icon: <MdPersonAdd />, label: 'Add Client' },
      { to: '/documents', icon: <MdFolder />, label: 'Documents' },
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
  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="sidebar-hamburger"
        onClick={onToggle}
        aria-label="Open menu"
      >
        <MdMenu size={22} />
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onToggle} />
      )}

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
          <div className="sidebar__user-avatar">OR</div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">Om Raj</span>
            <span className="sidebar__user-role">Administrator</span>
          </div>
          <MdSettings className="sidebar__user-settings" size={18} />
        </div>
      </aside>
    </>
  )
}
