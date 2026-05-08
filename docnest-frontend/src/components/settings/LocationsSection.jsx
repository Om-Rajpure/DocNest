import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import { MdAdd, MdEdit, MdDelete, MdLocationOn } from 'react-icons/md'
import { toast } from 'react-toastify'
import { locationService } from '../../services/locationService'
import ConfirmModal from '../ui/ConfirmModal'

export default function LocationsSection() {
  const [locs, setLocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [dlg, setDlg] = useState(false)
  const [edit, setEdit] = useState(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [delId, setDelId] = useState(null)

  const load = () => locationService.getAll().then(r => setLocs(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEdit(null); setName(''); setDlg(true) }
  const openEdit = (l) => { setEdit(l); setName(l.locationName); setDlg(true) }

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Name required'); return }
    setSaving(true)
    try {
      if (edit) await locationService.update(edit.id, { locationName: name.trim() })
      else await locationService.create({ locationName: name.trim() })
      toast.success(edit ? 'Location updated' : 'Location added')
      setDlg(false); load()
    } catch { toast.error('Failed — name may already exist') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await locationService.delete(delId); toast.success('Location deleted'); setDelId(null); load() }
    catch { toast.error('Cannot delete — may be in use') }
  }

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Location Management</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Manage location master data used in client onboarding.</Typography>
        </Box>
        <Button variant="contained" startIcon={<MdAdd size={16}/>} onClick={openAdd} size="small">Add Location</Button>
      </Box>
      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', px: 3, py: 1.5, background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
          <Typography variant="caption" sx={{ flex: 1, fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Location Name</Typography>
          <Typography variant="caption" sx={{ width: 100, textAlign: 'right', fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Actions</Typography>
        </Box>
        {locs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}><Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>No locations configured</Typography></Box>
        ) : locs.map((l, i) => (
          <Box key={l.id} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5, borderBottom: i < locs.length - 1 ? '1px solid var(--border)' : 'none', '&:hover': { background: 'var(--surface-2)' }, transition: 'background 0.15s' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <MdLocationOn size={16} color="var(--primary)" />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>{l.locationName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(l)} sx={{ color: 'var(--primary)' }}><MdEdit size={15}/></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton size="small" onClick={() => setDelId(l.id)} sx={{ color: 'var(--danger)' }}><MdDelete size={15}/></IconButton></Tooltip>
            </Box>
          </Box>
        ))}
      </Card>

      <Dialog open={dlg} onClose={() => setDlg(false)} maxWidth="xs" fullWidth
        slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', background: 'rgba(15,23,42,0.5)' } } }}>
        <DialogTitle sx={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>{edit ? 'Edit Location' : 'Add Location'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField fullWidth label="Location Name" value={name} onChange={e => setName(e.target.value)} autoFocus />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDlg(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? <CircularProgress size={18} sx={{ color: '#fff' }}/> : 'Save'}</Button>
        </DialogActions>
      </Dialog>

      <ConfirmModal open={!!delId} title="Delete Location" message="This may affect clients assigned to this location." onConfirm={handleDelete} onCancel={() => setDelId(null)} />
    </Box>
  )
}
