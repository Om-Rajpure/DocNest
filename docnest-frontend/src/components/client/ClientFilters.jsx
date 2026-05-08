import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { MdSearch, MdFilterList, MdClose } from 'react-icons/md'
import { locationService } from '../../services/locationService'

export default function ClientFilters({ onFilter }) {
  const [query, setQuery] = useState('')
  const [locationId, setLocId] = useState('')
  const [docStatus, setDocStatus] = useState('')
  const [locations, setLocations] = useState([])

  useEffect(() => {
    locationService.getAll().then(r => setLocations(r.data)).catch(() => {})
  }, [])

  const apply = () => onFilter({ query, locationId: locationId || undefined, docStatus })

  const reset = () => {
    setQuery(''); setLocId(''); setDocStatus('')
    onFilter({})
  }

  return (
    <Box sx={{ 
      display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center',
      background: 'var(--surface)', p: 2, borderRadius: 'var(--radius)', 
      border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' 
    }}>
      <Box sx={{ 
        flex: 1, minWidth: 240, display: 'flex', alignItems: 'center', gap: 1,
        background: 'var(--surface-2)', borderRadius: '24px', border: '1px solid var(--border)',
        px: 2, py: 0.5, transition: 'all 0.2s',
        '&:focus-within': { borderColor: 'var(--primary)', boxShadow: '0 0 0 3px rgba(79,70,229,0.1)' },
      }}>
        <MdSearch size={16} color="var(--text-muted)" />
        <input
          placeholder="Search by name or mobile…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          style={{ 
            border: 'none', background: 'transparent', outline: 'none', 
            width: '100%', fontSize: '0.875rem', fontFamily: 'var(--font-body)', 
            color: 'var(--text-primary)',
          }}
        />
        {query && (
          <IconButton size="small" onClick={() => { setQuery(''); onFilter({ query: '', locationId: locationId || undefined, docStatus }) }} sx={{ p: 0.3 }}>
            <MdClose size={14} color="var(--text-muted)" />
          </IconButton>
        )}
      </Box>
      <TextField select label="Location" value={locationId} onChange={e => setLocId(e.target.value)} sx={{ minWidth: 150 }}>
        <MenuItem value="">All Locations</MenuItem>
        {locations.map(l => <MenuItem key={l.id} value={l.id}>{l.locationName}</MenuItem>)}
      </TextField>
      <TextField select label="Doc Status" value={docStatus} onChange={e => setDocStatus(e.target.value)} sx={{ minWidth: 140 }}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="complete">Complete</MenuItem>
        <MenuItem value="missing">Missing Docs</MenuItem>
      </TextField>
      <Button variant="contained" onClick={apply} startIcon={<MdFilterList />} sx={{ height: 44 }}>Filter</Button>
      <Button variant="outlined" onClick={reset} sx={{ height: 44 }}>Reset</Button>
    </Box>
  )
}
