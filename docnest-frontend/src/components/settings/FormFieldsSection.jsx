import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import { MdSave, MdTune } from 'react-icons/md'
import { toast } from 'react-toastify'
import { settingsService } from '../../services/settingsService'

export default function FormFieldsSection() {
  const [fields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { settingsService.getFormFields().then(r => setFields(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false)) }, [])

  const toggle = (id, key) => setFields(fs => fs.map(f => f.id === id ? { ...f, [key]: !f[key] } : f))

  const save = async () => {
    setSaving(true)
    try { const r = await settingsService.updateFormFields(fields); setFields(r.data); toast.success('Form configuration saved') }
    catch { toast.error('Save failed') } finally { setSaving(false) }
  }

  if (loading) return <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>Client Form Configuration</Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Control which fields appear on the Add Client form and their requirements.</Typography>
        </Box>
        <Button variant="contained" startIcon={<MdSave size={16}/>} onClick={save} disabled={saving} size="small">
          {saving ? <CircularProgress size={18} sx={{ color: '#fff' }}/> : 'Save Changes'}
        </Button>
      </Box>
      <Card sx={{ overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5, background: 'var(--surface-2)', borderBottom: '1px solid var(--border)', gap: 2 }}>
          <Typography variant="caption" sx={{ flex: 1, fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Field</Typography>
          <Typography variant="caption" sx={{ width: 80, textAlign: 'center', fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Visible</Typography>
          <Typography variant="caption" sx={{ width: 80, textAlign: 'center', fontWeight: 700, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Required</Typography>
        </Box>
        {fields.map((f, i) => (
          <Box key={f.id} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 1.5, gap: 2, borderBottom: i < fields.length - 1 ? '1px solid var(--border)' : 'none', '&:hover': { background: 'var(--surface-2)' }, transition: 'background 0.15s' }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{f.label}</Typography>
                <Chip label={f.fieldType} size="small" sx={{ height: 18, fontSize: '0.55rem', fontWeight: 600, background: 'var(--surface-3)', color: 'var(--text-muted)' }}/>
              </Box>
              <Typography variant="caption" sx={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{f.description}</Typography>
            </Box>
            <Box sx={{ width: 80, textAlign: 'center' }}>
              <Switch checked={f.isVisible} onChange={() => toggle(f.id, 'isVisible')} size="small" color="primary"
                disabled={['firstName','lastName','mobile'].includes(f.fieldName)} />
            </Box>
            <Box sx={{ width: 80, textAlign: 'center' }}>
              <Switch checked={f.isRequired} onChange={() => toggle(f.id, 'isRequired')} size="small" color="warning"
                disabled={!f.isVisible || ['firstName','lastName','mobile'].includes(f.fieldName)} />
            </Box>
          </Box>
        ))}
      </Card>
      <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'var(--text-muted)', fontSize: '0.65rem' }}>
        First Name, Last Name, and Mobile are always visible and required.
      </Typography>
    </Box>
  )
}
