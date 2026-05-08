import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { MdWarning } from 'react-icons/md'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 'var(--radius-lg)' } }}
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', background: 'rgba(15,23,42,0.5)' } } }}
    >
      <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px',
            background: '#FEF2F2', color: 'var(--danger)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MdWarning size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 1 }}>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)', lineHeight: 1.6, ml: 7 }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onCancel} variant="outlined" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disabled={loading}
          sx={{ background: 'var(--danger)', '&:hover': { background: '#DC2626' } }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
