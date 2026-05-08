import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
import { MdHome } from 'react-icons/md'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', textAlign: 'center', p: 4,
    }}>
      <Typography sx={{ 
        fontSize: '6rem', fontWeight: 700, 
        fontFamily: 'var(--font-heading)', 
        color: 'var(--primary)', lineHeight: 1, mb: 1,
        opacity: 0.3,
      }}>
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600, fontFamily: 'var(--font-heading)', mb: 1 }}>
        Page not found
      </Typography>
      <Typography variant="body2" sx={{ color: 'var(--text-secondary)', mb: 4, maxWidth: 400 }}>
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </Typography>
      <Button 
        variant="contained" 
        startIcon={<MdHome />} 
        onClick={() => navigate('/')}
      >
        Back to Dashboard
      </Button>
    </Box>
  )
}
