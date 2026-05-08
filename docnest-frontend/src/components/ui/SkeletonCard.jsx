import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'

export default function SkeletonCard() {
  return (
    <Card sx={{ height: '100%', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="circular" width={44} height={44} sx={{ bgcolor: 'var(--surface-3)' }} />
        <Skeleton variant="rounded" width={28} height={28} sx={{ bgcolor: 'var(--surface-3)', borderRadius: '6px' }} />
      </Box>
      <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: 'var(--surface-3)', mb: 1 }} />
      <Skeleton variant="text" width="40%" height={14} sx={{ bgcolor: 'var(--surface-3)', mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Skeleton variant="rounded" width={48} height={24} sx={{ bgcolor: 'var(--surface-3)', borderRadius: '6px' }} />
        <Skeleton variant="rounded" width={48} height={24} sx={{ bgcolor: 'var(--surface-3)', borderRadius: '6px' }} />
      </Box>
    </Card>
  )
}
