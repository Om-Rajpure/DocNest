import Chip from '@mui/material/Chip'

const VARIANTS = {
  success: { bg: '#ECFDF5', color: '#065F46' },
  warning: { bg: '#FFFBEB', color: '#92400E' },
  error:   { bg: '#FEF2F2', color: '#991B1B' },
  info:    { bg: '#EFF6FF', color: '#1E40AF' },
  primary: { bg: '#EEF2FF', color: '#3730A3' },
}

export default function Badge({ label, variant = 'info' }) {
  const v = VARIANTS[variant] || VARIANTS.info
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        background: v.bg,
        color: v.color,
        fontWeight: 600,
        fontSize: '0.7rem',
        height: 24,
        borderRadius: '6px',
        fontFamily: 'var(--font-body)',
      }}
    />
  )
}
