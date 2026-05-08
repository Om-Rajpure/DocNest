import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import { MdAdd, MdEdit, MdDelete, MdDescription } from 'react-icons/md'
import { toast } from 'react-toastify'
import { settingsService } from '../../services/settingsService'
import ConfirmModal from '../ui/ConfirmModal'

const EMPTY = { typeName: '', displayName: '', description: '', isRequired: true, isActive: true, allowedExtensions: 'pdf,jpg,jpeg,png', maxSizeMb: 20 }

export default function DocTypesSection() {
  const [types, setTypes] = useState([])
  const [loading, setLoading] = useState(true)
  const [dlg, setDlg] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [delId, setDelId] = useState(null)

  const load = () => settingsService.getDocTypes().then(r => setTypes(r.data)).catch(() => {}).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openAdd = () => { setEditId(null); setForm(EMPTY); setDlg(true) }
  const openEdit = (t) => { setEditId(t.id); setForm(t); setDlg(true) }
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const toggleInline = async (t, key) => {
    try { await settingsService.updateDocType(t.id, { ...t, [key]: !t[key] }); load() } catch { toast.error('Update failed') }
  }

  const handleSave = async () => {
    if (!form.typeName?.trim() || !form.displayName?.trim()) { toast.error('Name required'); return }
    setSaving(true)
    try {
      if (editId) await settingsService.updateDocType(editId, form)
      else await settingsService.addDocType({ ...form, typeName: form.typeName.toUpperCase().replace(/\s+/g, '_') })
      toast.success(editId ? 'Updated' : 'Added')
      setDlg(false); load()
    } catch { toast.error('Failed — type may already exist') }
    finally { setSaving(false) }
  }

  const handleDelete = async () => {
    try { await settingsService.deleteDocType(delId); toast.success('Deleted'); setDelId(null); load() }
    catch { toast.error('Delete failed') }
  }

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Document Configuration</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Manage which document types are required in the system.</Typography>
        </Box>
        <Button variant="contained" startIcon={<MdAdd size={16}/>} onClick={openAdd} size="small">Add Type</Button>
      </Box>
      <Card sx={{ overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', px: 3, py: 1.5, background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', gap: 2 }}>
          <Typography variant="caption" sx={{ flex: 1, fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Document Type</Typography>
          <Typography variant="caption" sx={{ width: 70, textAlign: 'center', fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Active</Typography>
          <Typography variant="caption" sx={{ width: 70, textAlign: 'center', fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Required</Typography>
          <Typography variant="caption" sx={{ width: 80, textAlign: 'right', fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Actions</Typography>
        </Box>
        {types.map((t, i) => (
          <Box key={t.id} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.25, gap: 2, borderBottom: i < types.length - 1 ? '1px solid var(--border)' : 'none', '&:hover': { background: 'var(--surface-2)' }, transition: 'background 0.15s' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MdDescription size={14} color={t.isActive ? 'var(--primary)' : 'var(--text-muted)'} />
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.82rem', color: t.isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>{t.displayName}</Typography>
                <Chip label={t.allowedExtensions} size="small" sx={{ height: 16, fontSize: '0.5rem', background: 'var(--surface-3)', color: 'var(--text-muted)' }}/>
                <Chip label={`${t.maxSizeMb}MB`} size="small" sx={{ height: 16, fontSize: '0.5rem', background: 'var(--surface-3)', color: 'var(--text-muted)' }}/>
              </Box>
              {t.description && <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>{t.description}</Typography>}
            </Box>
            <Box sx={{ width: 70, textAlign: 'center' }}><Switch checked={t.isActive} onChange={() => toggleInline(t, 'isActive')} size="small"/></Box>
            <Box sx={{ width: 70, textAlign: 'center' }}><Switch checked={t.isRequired} onChange={() => toggleInline(t, 'isRequired')} size="small" color="warning" disabled={!t.isActive}/></Box>
            <Box sx={{ width: 80, display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
              <Tooltip title="Edit"><IconButton size="small" onClick={() => openEdit(t)} sx={{ color: 'var(--primary)' }}><MdEdit size={14}/></IconButton></Tooltip>
              <Tooltip title="Delete"><IconButton size="small" onClick={() => setDelId(t.id)} sx={{ color: 'var(--danger)' }}><MdDelete size={14}/></IconButton></Tooltip>
            </Box>
          </Box>
        ))}
      </Card>

      <Dialog open={dlg} onClose={() => setDlg(false)} maxWidth="sm" fullWidth
        slotProps={{ backdrop: { sx: { backdropFilter: 'blur(4px)', background: 'rgba(15,23,42,0.5)' } } }}>
        <DialogTitle sx={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>{editId ? 'Edit Document Type' : 'Add Document Type'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField fullWidth label="Type Key" value={form.typeName} onChange={set('typeName')} disabled={!!editId} helperText="e.g. PASSPORT" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Display Name" value={form.displayName} onChange={set('displayName')} /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Description" value={form.description || ''} onChange={set('description')} /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Allowed Extensions" value={form.allowedExtensions} onChange={set('allowedExtensions')} helperText="comma separated" /></Grid>
            <Grid item xs={6}><TextField fullWidth label="Max Size (MB)" type="number" value={form.maxSizeMb} onChange={e => setForm(f => ({...f, maxSizeMb: parseInt(e.target.value)||20}))} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setDlg(false)} variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}>{saving ? <CircularProgress size={18} sx={{ color: '#fff' }}/> : 'Save'}</Button>
        </DialogActions>
      </Dialog>
      <ConfirmModal open={!!delId} title="Delete Document Type" message="This will remove the document type from the system." onConfirm={handleDelete} onCancel={() => setDelId(null)} />
    </Box>
  )
}
