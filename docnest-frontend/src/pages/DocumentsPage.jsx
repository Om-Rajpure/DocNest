import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DocumentCard from '../components/document/DocumentCard'
import DocumentPreviewModal from '../components/document/DocumentPreviewModal'
import DropzoneUpload from '../components/document/DropzoneUpload'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { clientService } from '../services/clientService'
import { documentService } from '../services/documentService'
import { docTypeLabel } from '../utils/formatters'
import { toast } from 'react-toastify'

export default function DocumentsPage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const [clients, setClients] = useState([])
  const [selectedClient, setSelectedClient] = useState(clientId || '')
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadType, setUploadType] = useState('')
  const [replaceId, setReplaceId] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    clientService.getAll({ page: 0, size: 500 })
      .then(r => setClients(r.data.content || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedClient) loadDocs()
  }, [selectedClient])

  const loadDocs = async () => {
    setLoading(true)
    try { const r = await documentService.getByClient(selectedClient); setDocs(r.data) }
    catch {} finally { setLoading(false) }
  }

  const handleUpload = (type, docId) => {
    setUploadType(type)
    setReplaceId(docId)
    setUploadOpen(true)
  }

  const handleFileSelected = async (file) => {
    setUploading(true)
    try {
      if (replaceId) await documentService.replace(replaceId, file)
      else await documentService.upload(selectedClient, uploadType, file)
      toast.success(replaceId ? 'Document replaced' : 'Document uploaded')
      setUploadOpen(false)
      loadDocs()
    } catch (e) { toast.error(e.message) }
    finally { setUploading(false) }
  }

  return (
    <Box className="page-enter">
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>Document Management</Typography>
        <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>Upload, preview, and manage client documents.</Typography>
      </Box>

      {/* Client Selector */}
      <Card sx={{ mb: 4, p: 2.5 }}>
        <TextField
          select fullWidth label="Select Client"
          value={selectedClient}
          onChange={e => { setSelectedClient(e.target.value); navigate(`/documents/${e.target.value}`, { replace: true }) }}
        >
          {clients.map(c => (
            <MenuItem key={c.id} value={c.id}>{c.firstName} {c.lastName} — {c.mobile}</MenuItem>
          ))}
        </TextField>
      </Card>

      {/* Documents */}
      {!selectedClient ? (
        <EmptyState icon="📄" title="Select a client" description="Choose a client from the dropdown to manage their documents." />
      ) : loading ? (
        <Spinner />
      ) : (
        <Card sx={{ p: 4 }}>
          <DocumentCard clientId={selectedClient} documents={docs} onRefresh={loadDocs} onPreview={setPreviewDoc} onUpload={handleUpload} />
        </Card>
      )}

      <DocumentPreviewModal open={!!previewDoc} document={previewDoc} onClose={() => setPreviewDoc(null)} />

      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>{replaceId ? 'Replace' : 'Upload'} {docTypeLabel(uploadType)}</DialogTitle>
        <DialogContent><DropzoneUpload onFileSelected={handleFileSelected} uploading={uploading} progress={uploading ? 80 : 0} /></DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}><Button onClick={() => setUploadOpen(false)} variant="outlined">Cancel</Button></DialogActions>
      </Dialog>
    </Box>
  )
}
