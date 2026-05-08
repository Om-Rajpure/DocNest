import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MdMenu, MdSearch, MdNotificationsNone, MdClose } from 'react-icons/md'

const PAGE_TITLES = {
  '/':            'Overview',
  '/clients':     'Clients',
  '/clients/add': 'Add Client',
  '/documents':   'Documents',
  '/import':      'Excel Import',
  '/activity':    'Activity Logs',
  '/settings':    'Settings',
}

export default function Topbar({ onToggle }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const title = Object.entries(PAGE_TITLES)
    .reverse()
    .find(([path]) => location.pathname.startsWith(path))?.[1] || 'DocNest'

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/clients?query=${encodeURIComponent(search.trim())}`)
      setSearch('')
    }
  }

  return (
    <div className="top-bar">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton 
          onClick={onToggle} 
          size="small" 
          sx={{ 
            color: 'var(--text-secondary)', 
            '&:hover': { background: 'var(--surface-3)' } 
          }}
        >
          <MdMenu size={20} />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: 'var(--text-primary)', 
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <div className="search-field">
          <MdSearch size={18} color="var(--text-muted)" />
          <input
            placeholder="Search clients, documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
          />
          {search && (
            <IconButton size="small" onClick={() => setSearch('')} sx={{ p: 0.3, color: 'var(--text-muted)' }}>
              <MdClose size={14} />
            </IconButton>
          )}
        </div>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Notifications">
            <IconButton size="small" sx={{ color: 'var(--text-secondary)', position: 'relative' }}>
              <MdNotificationsNone size={22} />
              <Box sx={{ 
                position: 'absolute', top: 6, right: 6, 
                width: 7, height: 7, 
                background: 'var(--danger)', 
                borderRadius: '50%', 
                border: '2px solid var(--surface)' 
              }} />
            </IconButton>
          </Tooltip>
          <Box sx={{ width: 1, height: 28, background: 'var(--border)', mx: 1 }} />
          <Avatar sx={{ 
            width: 34, height: 34, 
            bgcolor: 'var(--primary)', 
            fontSize: '0.8rem', fontWeight: 700, 
            cursor: 'pointer',
            fontFamily: 'var(--font-heading)',
          }}>
            OR
          </Avatar>
        </Box>
      </Box>
    </div>
  )
}
