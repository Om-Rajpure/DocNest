import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Grid from '@mui/material/Grid'
import { MdVisibility, MdUpload, MdDelete, MdCheckCircle, MdCancel, MdPictureAsPdf, MdImage } from 'react-icons/md'
import Badge from '../ui/Badge'
import ConfirmModal from '../ui/ConfirmModal'
import { docTypeLabel, formatDate } from '../../utils/formatters'
import { documentService } from '../../services/documentService'
import { toast } from 'react-toastify'

const DOC_TYPES = ['AADHAR', 'PAN', 'DRIVING_LICENSE', 'ELECTRICITY_BILL']

export default function DocumentCard({ clientId, documents, onRefresh, onPreview, onUpload }) {
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const docMap = {}
  documents?.forEach(d => { docMap[d.documentType] = d })

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await documentService.delete(confirmId)
      toast.success('Document deleted')
      onRefresh?.()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setDeleting(false)
      setConfirmId(null)
    }
  }

  return (
    <>
      <Grid container spacing={2}>
        {DOC_TYPES.map(type => {
          const doc = docMap[type]
          const isImage = doc?.fileName?.match(/\.(jpg|jpeg|png)$/i)
          return (
            <Grid item xs={12} sm={6} key={type}>
              <Box sx={{
                p: 2.5, borderRadius: 'var(--radius)',
                border: doc ? '1px solid var(--border)' : '2px dashed var(--border-strong)',
                background: doc ? 'var(--surface)' : 'var(--surface-2)',
                transition: 'all 0.15s',
                '&:hover': { boxShadow: 'var(--shadow-sm)' },
                '&:hover .doc-actions': { opacity: 1 },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ 
                    fontSize: 28, 
                    color: doc ? 'var(--success)' : 'var(--danger)',
                    mt: 0.5,
                  }}>
                    {doc ? (isImage ? <MdImage /> : <MdPictureAsPdf />) : <MdCancel />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', mb: 0.5 }}>
                      {docTypeLabel(type)}
                    </Typography>
                    {doc ? (
                      <>
                        <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block' }} noWrap>
                          {doc.fileName}
                        </Typography>
                        {doc.uploadedAt && (
                          <Typography sx={{ color: 'var(--text-muted)', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', mt: 0.5 }}>
                            {formatDate(doc.uploadedAt)}
                          </Typography>
                        )}
                      </>
                    ) : (
                      <Typography variant="caption" sx={{ color: 'var(--danger)', fontWeight: 600 }}>Not Uploaded</Typography>
                    )}
                  </Box>
                  <Badge label={doc ? 'Verified' : 'Missing'} variant={doc ? 'success' : 'error'} />
                </Box>

                {/* Action icons — visible on hover */}
                <Box className="doc-actions" sx={{ 
                  display: 'flex', justifyContent: 'flex-end', gap: 0.5, mt: 1.5,
                  opacity: 0, transition: 'opacity 0.15s',
                }}>
                  {doc ? (
                    <>
                      <Tooltip title="Preview"><IconButton size="small" onClick={() => onPreview?.(doc)} sx={{ color: 'var(--primary)' }}><MdVisibility size={16} /></IconButton></Tooltip>
                      <Tooltip title="Replace"><IconButton size="small" onClick={() => onUpload?.(type, doc.id)} sx={{ color: 'var(--warning)' }}><MdUpload size={16} /></IconButton></Tooltip>
                      <Tooltip title="Delete"><IconButton size="small" onClick={() => setConfirmId(doc.id)} sx={{ color: 'var(--danger)' }}><MdDelete size={16} /></IconButton></Tooltip>
                    </>
                  ) : (
                    <Tooltip title="Upload"><IconButton size="small" onClick={() => onUpload?.(type, null)} sx={{ color: 'var(--success)' }}><MdUpload size={16} /></IconButton></Tooltip>
                  )}
                </Box>
              </Box>
            </Grid>
          )
        })}
      </Grid>
      <ConfirmModal open={!!confirmId} title="Delete Document" message="This will permanently delete this document." onConfirm={handleDelete} onCancel={() => setConfirmId(null)} loading={deleting} />
    </>
  )
}
