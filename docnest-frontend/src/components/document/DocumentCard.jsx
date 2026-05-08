import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import LinearProgress from '@mui/material/LinearProgress'
import Chip from '@mui/material/Chip'
import { MdCloudUpload, MdVisibility, MdAutorenew, MdDelete, MdCheckCircle, MdWarning, MdInsertDriveFile } from 'react-icons/md'
import { toast } from 'react-toastify'
import { documentService } from '../../services/documentService'
import { docTypeLabel, formatDate } from '../../utils/formatters'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../../utils/validators'

const DOC_ICONS = {
  AADHAR:           { icon: '🪪', color: '#4F46E5' },
  PAN:              { icon: '🏦', color: '#10B981' },
  DRIVING_LICENSE:  { icon: '🚗', color: '#F59E0B' },
  ELECTRICITY_BILL: { icon: '⚡', color: '#EF4444' },
}

/**
 * Premium document card — used for both Client and FamilyMember documents.
 * Props: ownerType, ownerId, docType, document (existing doc or null), onRefresh, onPreview, compact
 */
export default function DocumentCard({ ownerType, ownerId, docType, document: doc, onRefresh, onPreview, compact }) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [deleting, setDeleting] = useState(false)

  const meta = DOC_ICONS[docType] || { icon: '📄', color: '#6B7280' }
  const isUploaded = !!doc

  const handleUpload = useCallback(async (file) => {
    setUploading(true)
    setProgress(30)
    try {
      if (doc) {
        await documentService.replace(doc.id, file)
        toast.success(`${docTypeLabel(docType)} replaced successfully`)
      } else {
        await documentService.upload(ownerType, ownerId, docType, file)
        toast.success(`${docTypeLabel(docType)} uploaded successfully`)
      }
      setProgress(100)
      onRefresh?.()
    } catch (e) {
      toast.error(e.response?.data?.message || 'Upload failed')
    } finally {
      setTimeout(() => { setUploading(false); setProgress(0) }, 400)
    }
  }, [doc, ownerType, ownerId, docType, onRefresh])

  const handleDelete = async () => {
    if (!doc) return
    setDeleting(true)
    try {
      await documentService.delete(doc.id)
      toast.success(`${docTypeLabel(docType)} deleted`)
      onRefresh?.()
    } catch (e) {
      toast.error('Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file. Allowed: PDF, JPG, PNG (max 20MB)')
      return
    }
    handleUpload(accepted[0])
  }, [handleUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: false,
    noClick: isUploaded,
    noDrag: isUploaded,
  })

  const cardHeight = compact ? 180 : 220

  return (
    <Box sx={{
      border: isUploaded ? '1px solid var(--border)' : '2px dashed var(--border-strong)',
      borderRadius: 'var(--radius)',
      p: compact ? 2 : 2.5,
      background: isUploaded ? '#fff' : 'var(--surface-2)',
      transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
      position: 'relative',
      overflow: 'hidden',
      minHeight: cardHeight,
      display: 'flex',
      flexDirection: 'column',
      '&:hover': {
        borderColor: meta.color,
        boxShadow: `0 0 0 1px ${meta.color}22, 0 4px 20px ${meta.color}11`,
        transform: 'translateY(-2px)',
      },
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: compact ? 32 : 40, height: compact ? 32 : 40,
            borderRadius: 'var(--radius-sm)',
            background: `${meta.color}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: compact ? '1rem' : '1.3rem',
          }}>
            {meta.icon}
          </Box>
          <Box>
            <Typography variant={compact ? 'body2' : 'subtitle2'} sx={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {docTypeLabel(docType)}
            </Typography>
            {isUploaded && !compact && (
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                {doc.fileName}
              </Typography>
            )}
          </Box>
        </Box>
        <Chip
          size="small"
          icon={isUploaded ? <MdCheckCircle size={14} /> : <MdWarning size={14} />}
          label={isUploaded ? 'Uploaded' : 'Missing'}
          sx={{
            fontWeight: 600,
            fontSize: '0.65rem',
            height: 24,
            backgroundColor: isUploaded ? '#ECFDF5' : '#FFF7ED',
            color: isUploaded ? '#059669' : '#D97706',
            border: `1px solid ${isUploaded ? '#A7F3D0' : '#FDE68A'}`,
            '& .MuiChip-icon': { color: isUploaded ? '#059669' : '#D97706' },
          }}
        />
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isUploaded ? (
          <Box sx={{ textAlign: 'center', width: '100%' }}>
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
              py: 1.5, px: 2,
              background: 'var(--surface-2)',
              borderRadius: 'var(--radius-sm)',
              mb: 1,
            }}>
              <MdInsertDriveFile size={18} color="var(--primary)" />
              <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 500, maxWidth: 180 }} noWrap>
                {doc.fileName}
              </Typography>
            </Box>
            {!compact && doc.uploadDate && (
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
                Uploaded {formatDate(doc.uploadDate)}
              </Typography>
            )}
          </Box>
        ) : (
          <Box {...getRootProps()} sx={{
            width: '100%', cursor: 'pointer', textAlign: 'center', py: compact ? 1.5 : 2.5,
            borderRadius: 'var(--radius-sm)',
            transition: 'all 0.2s',
            '&:hover': { background: `${meta.color}08` },
          }}>
            <input {...getInputProps()} />
            <MdCloudUpload size={compact ? 24 : 32} color={isDragActive ? meta.color : 'var(--border-strong)'} />
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'var(--primary)', fontWeight: 600, fontSize: compact ? '0.65rem' : '0.75rem' }}>
              {isDragActive ? 'Drop file here' : 'Drag & drop or click'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
              PDF, JPG, PNG
            </Typography>
          </Box>
        )}
      </Box>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 4, borderRadius: 2,
              bgcolor: `${meta.color}20`,
              '& .MuiLinearProgress-bar': { background: meta.color, borderRadius: 2 },
            }}
          />
        </Box>
      )}

      {/* Actions */}
      {isUploaded && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mt: 1.5, pt: 1.5, borderTop: '1px solid var(--border)' }}>
          <Tooltip title="Preview">
            <IconButton size="small" onClick={() => onPreview?.(doc)} sx={{ color: 'var(--primary)' }}>
              <MdVisibility size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Replace">
            <IconButton size="small" component="label" sx={{ color: 'var(--accent)' }} disabled={uploading}>
              <MdAutorenew size={16} />
              <input type="file" hidden accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={handleDelete} disabled={deleting} sx={{ color: 'var(--danger)' }}>
              <MdDelete size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  )
}
