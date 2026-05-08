import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { MdFolder } from 'react-icons/md'

export default function EmptyState({ icon, title, description, actionLabel, onAction }) {
  return (
    <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
      <Box sx={{ 
        width: 80, height: 80, 
        border: '2px dashed var(--border-strong)', 
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mx: 'auto', mb: 3,
        background: 'var(--surface-3)',
      }}>
        <Box sx={{ fontSize: 36, lineHeight: 1, color: 'var(--text-muted)' }}>
          {icon || <MdFolder />}
        </Box>
      </Box>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600, color: 'var(--text-primary)', mb: 1,
          fontFamily: 'var(--font-heading)',
        }}
      >
        {title || 'Nothing here yet'}
      </Typography>
      {description && (
        <Typography 
          variant="body2" 
          sx={{ color: 'var(--text-secondary)', mb: 3, maxWidth: 360, mx: 'auto', lineHeight: 1.6 }}
        >
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} size="small">
          {actionLabel}
        </Button>
      )}
    </Box>
  )
}
