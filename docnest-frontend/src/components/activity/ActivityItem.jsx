import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { actionLabel, actionColor, timeAgo } from '../../utils/formatters'

export default function ActivityItem({ log, isLast }) {
  const color = actionColor(log.action)
  return (
    <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
      {/* Timeline line */}
      {!isLast && (
        <Box sx={{ position: 'absolute', left: 4, top: 18, bottom: -16, width: 1, background: 'var(--border)' }} />
      )}
      {/* Dot */}
      <Box className="activity-dot" sx={{ background: color }} />
      {/* Content */}
      <Box sx={{ flex: 1, pb: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 0.3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
            {actionLabel(log.action)}
          </Typography>
          <Typography sx={{ 
            color: 'var(--text-muted)', flexShrink: 0, fontSize: '0.65rem',
            fontFamily: 'var(--font-mono)', fontWeight: 500,
          }}>
            {timeAgo(log.timestamp)}
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          {log.description}
        </Typography>
      </Box>
    </Box>
  )
}
