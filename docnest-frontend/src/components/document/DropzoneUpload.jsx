import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import { MdCloudUpload, MdCheckCircle } from 'react-icons/md'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE_MB } from '../../utils/validators'
import { toast } from 'react-toastify'

export default function DropzoneUpload({ onFileSelected, uploading, progress }) {
  const [selectedFile, setSelectedFile] = useState(null)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Invalid file type or size. Allowed: PDF, JPG, PNG (max 20MB)')
      return
    }
    const file = accepted[0]
    setSelectedFile(file)
    onFileSelected?.(file)
  }, [onFileSelected])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: false,
  })

  return (
    <Box>
      <Box {...getRootProps()} className={`dropzone-area${isDragActive ? ' active' : ''}`}>
        <input {...getInputProps()} />
        {selectedFile ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <MdCheckCircle size={40} color="var(--success)" />
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)' }}>{selectedFile.name}</Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>Click to change file</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <MdCloudUpload size={44} color={isDragActive ? 'var(--primary)' : 'var(--border-strong)'} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--primary)' }}>
                {isDragActive ? 'Drop file here' : 'Drag & drop or click to browse'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', mt: 0.5 }}>
                PDF, JPG, PNG — max {MAX_FILE_SIZE_MB}MB
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'var(--primary)', fontWeight: 600 }}>Uploading…</Typography>
            <Typography variant="caption" sx={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>{progress}%</Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 6, borderRadius: 3, 
              bgcolor: 'var(--primary-light)',
              '& .MuiLinearProgress-bar': { background: 'var(--primary)', borderRadius: 3 } 
            }} 
          />
        </Box>
      )}
    </Box>
  )
}
