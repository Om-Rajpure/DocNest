import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

export default function Spinner({ message }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 10 }}>
      <CircularProgress size={36} thickness={4} sx={{ color: 'var(--primary)', mb: 2 }} />
      {message && (
        <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 500 }}>
          {message}
        </Typography>
      )}
    </Box>
  )
}
