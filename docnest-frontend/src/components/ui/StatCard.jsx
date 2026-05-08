import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function StatCard({ title, value, sub, icon, color = '#4F46E5' }) {
  const bgMap = {
    '#4F46E5': '#EEF2FF', '#6366F1': '#EEF2FF',
    '#0EA5E9': '#F0F9FF', '#8B5CF6': '#F5F3FF',
    '#10B981': '#ECFDF5', '#F59E0B': '#FFFBEB',
    '#EF4444': '#FEF2F2',
  }
  const iconBg = bgMap[color] || '#EEF2FF'

  return (
    <Card className="stat-card" sx={{ height: '100%' }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ 
          width: 40, height: 40, borderRadius: '10px', 
          background: iconBg, color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          mb: 2,
        }}>
          {icon}
        </Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'var(--text-muted)', fontWeight: 600, 
            textTransform: 'uppercase', letterSpacing: '0.05em', 
            fontSize: '0.65rem', display: 'block', mb: 0.5,
            fontFamily: 'var(--font-body)',
          }}
        >
          {title}
        </Typography>
        <Typography 
          sx={{ 
            fontWeight: 700, color: 'var(--text-primary)', 
            fontSize: '2rem', lineHeight: 1.1, mb: 0.5,
            fontFamily: 'var(--font-heading)',
          }}
        >
          {value ?? '0'}
        </Typography>
        {sub && (
          <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem' }}>
            {sub}
          </Typography>
        )}
      </Box>
    </Card>
  )
}
