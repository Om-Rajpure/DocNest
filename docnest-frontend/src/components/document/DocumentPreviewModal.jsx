import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { MdClose, MdDownload } from 'react-icons/md'
import Badge from '../ui/Badge'
import { docTypeLabel, formatDate } from '../../utils/formatters'

export default function DocumentPreviewModal({ open, document: doc, onClose }) {
  if (!doc) return null

  const previewUrl = `/api/documents/preview/${doc.id}`
  const isImage = doc.fileName?.match(/\.(jpg|jpeg|png)$/i)

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      slotProps={{ backdrop: { sx: { backdropFilter: 'blur(6px)', background: 'rgba(15,23,42,0.6)' } } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, pt: 3, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h6" sx={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem' }}>
            {doc.fileName}
          </Typography>
          <Badge label={docTypeLabel(doc.documentType)} variant="primary" />
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'var(--text-muted)' }}>
          <MdClose size={20} />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ px: 3, pb: 0 }}>
        {doc.uploadDate && (
          <Typography variant="caption" sx={{ display: 'block', mb: 1.5, color: 'var(--text-muted)' }}>
            Uploaded on {formatDate(doc.uploadDate)}
          </Typography>
        )}
        <Box sx={{ 
          background: 'var(--surface-3)', borderRadius: 'var(--radius)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: 400, overflow: 'hidden',
        }}>
          {isImage ? (
            <img src={previewUrl} alt={doc.fileName} style={{ maxWidth: '100%', maxHeight: 500, objectFit: 'contain' }} />
          ) : (
            <iframe src={previewUrl} title={doc.fileName} style={{ width: '100%', height: 500, border: 'none' }} />
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button 
          variant="outlined" 
          startIcon={<MdDownload />} 
          component="a" 
          href={previewUrl} 
          download
        >
          Download
        </Button>
        <Button variant="outlined" onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
