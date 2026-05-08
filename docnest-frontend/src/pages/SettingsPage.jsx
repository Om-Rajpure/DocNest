import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import { MdInfo } from 'react-icons/md'

export default function SettingsPage() {
  return (
    <Box className="page-enter">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>Settings</Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Manage application preferences and configurations.</Typography>
      </Box>

      <Card sx={{ p: 6, textAlign: 'center' }}>
        <Box sx={{ 
          width: 80, height: 80, 
          border: '2px dashed var(--border-strong)', 
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mx: 'auto', mb: 3,
          background: 'var(--surface-3)',
        }}>
          <Box sx={{ fontSize: 36 }}>⚙️</Box>
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontFamily: 'var(--font-heading)' }}>Settings Module</Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 4, maxWidth: 400, mx: 'auto' }}>
          We're building advanced configuration options including location management, user roles, and system preferences.
        </Typography>
        <Chip icon={<MdInfo />} label="Coming in Version 2.0" sx={{ fontWeight: 600, background: 'var(--primary-light)', color: 'var(--primary)' }} />
      </Card>
    </Box>
  )
}
